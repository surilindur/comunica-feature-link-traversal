from json import loads, dumps

with open("stats-hybrid-filter.log", "r") as stats_file:
    data = loads(stats_file.read())

counts = {}

for d in data:
    ds = dumps(d, sort_keys=True)
    if ds in counts:
        counts[ds] += 1
    else:
        counts[ds] = 1

avg = sum(counts.values()) / len(counts)

print(f"average {avg} duplicates")
