import csv
import json


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
        if (
            currentGroup
            and obs["id"] == prevId + 1
            and obs["species"] == currentGroup["species"]
            and obs["time"] > currentGroup["times"][-1]
            and obs["time"].split("-")[0] == currentGroup["times"][0].split("-")[0]
        ):
            currentGroup["coords"].append(obs["coord"])
            currentGroup["times"].append(obs["time"])
        else:
            if currentGroup:
                groups.append(currentGroup)
            currentGroup = {
                "id": id,
                "species": obs["species"],
                "times": [obs["time"]],
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
            "times": group["times"],
        },
    }


def toGeoJson(groups):
    return json.dumps(
        {"type": "FeatureCollection", "features": [toFeature(g) for g in groups]}
    )


birds = groupByBird(parseFile("clean_bird_migration.csv"))
print(toGeoJson(birds))

# seen = set()
# oneBySpecies = [
#     seen.add(bird["species"]) or bird for bird in birds if bird["species"] not in seen
# ]
# print(toGeoJson(oneBySpecies))
