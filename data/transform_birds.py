import csv
import json
import datetime
import dateutil.parser


def parseFile(file):
    with open(file, newline="") as csvfile:
        reader = csv.DictReader(csvfile, delimiter=",", quotechar='"')
        rows = [
            {
                "id": int(row["occurrenceID"]),
                "species": row["species"],
                "coord": [float(row["longitude"]), float(row["latitude"])],
                "time": row["date"],
            }
            for row in reader
            if row["longitude"] and row["latitude"]
        ]
        return rows


# group by consecutive concurrenceIDs of the same species
def groupByBird(observations):
    sortedObs = sorted(observations, key=lambda row: row["id"])
    id = 0
    groups = []
    currentGroup = None
    prevId = -1
    for obs in sortedObs:
        time = dateutil.parser.isoparse(obs["time"])
        if (
            currentGroup
            and obs["id"] == prevId + 1
            and obs["species"] == currentGroup["species"]
            and time > currentGroup["times"][-1]
            and time.year == currentGroup["times"][0].year
        ):
            currentGroup["coords"].append(obs["coord"])
            currentGroup["times"].append(time)
        else:
            if currentGroup:
                groups.append(currentGroup)
            currentGroup = {
                "id": id,
                "species": obs["species"],
                "times": [time],
                "coords": [obs["coord"]],
            }
            id += 1
        prevId = obs["id"]

    if currentGroup:
        groups.append(currentGroup)
    return groups


def toFeature(group):
    return {
        "id": group["id"],
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": group["coords"],
        },
        "properties": {
            "species": group["species"],
            "times": [int(dt.timestamp()) for dt in group["times"]],
        },
    }


def toGeoJson(groups):
    return json.dumps(
        {"type": "FeatureCollection", "features": [
            toFeature(g) for g in groups]}
    )


birds = groupByBird(parseFile("clean_bird_migration.csv"))

print(toGeoJson(birds))
