import os
import numpy as np

mypath = os.path.dirname(__file__)
BalancesFile = "Balances.txt"
SkinReleasesFile = "SkinReleases.txt"
Buffs = []
Nerfs = []
Adjustments = []
buffedChamps = []
nerfedChamps = []
adjustedChamps = []

numOfPatchesToCheck = 2

with open(os.path.join(mypath, BalancesFile), "r") as f:
  Balances = f.read().splitlines()
  for patch, line in enumerate(Balances, 0):
    skins = line.split()
    Buffs.append([])
    Nerfs.append([])
    Adjustments.append([])
    if (patch < max(3-numOfPatchesToCheck, 0)):
      continue
    for i, champ in enumerate(skins, 1):
      if i == 1:
        continue
      elif champ.startswith("+"):
        if (champ[1:] not in buffedChamps):
          buffedChamps.append(champ[1:])
        Buffs[patch].append(champ[1:])
      elif champ.startswith("-"):
        if (champ[1:] not in nerfedChamps):
          nerfedChamps.append(champ[1:])
        Nerfs[patch].append(champ[1:])
      elif champ.startswith("."):
        if (champ[1:] not in adjustedChamps):
          adjustedChamps.append(champ[1:])
        Adjustments[patch].append(champ[1:])
      else:
        print("Error: Unrecognized change type")
        print(champ)

skins = []
with open(os.path.join(mypath, SkinReleasesFile), "r") as f:
  SkinReleases = f.read().splitlines()
  for patch, line in enumerate(SkinReleases, 0):
    champs = line.split()
    skins.append([])
    for i, champ in enumerate(champs, 1):
      if i == 1:
        continue
      else:
        skins[patch].append(champ)

numBuffsBeforeSkin = 0
numNerfsBeforeSkin = 0
numAdjustmentsBeforeSkin = 0


def isInLastNPatches(champ, data, start: int, n: int) -> bool:
  for i in range(start-n, start+1):
    if (i < 0):
      continue
    if champ in data[i]:
      return True
  return False


buffBeforeSkin = []
nerfBeforeSkin = []
adjBeforeSkin = []

for patch, data in enumerate(skins, 0):
  for champ in data:
    if isInLastNPatches(champ, Buffs, patch, numOfPatchesToCheck):
      numBuffsBeforeSkin += 1
      buffBeforeSkin.append(champ)
    if isInLastNPatches(champ, Nerfs, patch, numOfPatchesToCheck):
      numNerfsBeforeSkin += 1
      nerfBeforeSkin.append(champ)
    if isInLastNPatches(champ, Adjustments, patch, numOfPatchesToCheck):
      numAdjustmentsBeforeSkin += 1
      adjBeforeSkin.append(champ)

print("Data for last " + str(numOfPatchesToCheck) + " patches")
print("Buffs before skin: " + str(numBuffsBeforeSkin))
print("Nerfs before skin: " + str(numNerfsBeforeSkin))
print("Adjustments before skin: " + str(numAdjustmentsBeforeSkin))
print()
print("BuffsTotal: " + str(sum(len(x) for x in Buffs)))
print("NerfsTotal: " + str(sum(len(x) for x in Nerfs)))
buffNerfRatio = sum(len(x) for x in Buffs)/sum(len(x) for x in Nerfs)
print("AdjustmentsTotal: " + str(sum(len(x) for x in Adjustments)))
print()
print("uniqueBuffedChamps: " + str(len(buffedChamps)))
print("uniqueNerfedChamps: " + str(len(nerfedChamps)))
uniqueBuffNerfRatio = len(buffedChamps)/len(nerfedChamps)
print("uniqueAdjustedChamps: " + str(len(adjustedChamps)))
print()
print("SkinsTotal: " + str(sum(len(x) for x in skins)))
print()
print("Buffs before skin relative to Buff/Nerf ratio: " +
      str(numBuffsBeforeSkin/numNerfsBeforeSkin / buffNerfRatio))
print("Buffs before skin relative to unique Buff/Nerf ratio: " +
      str(numBuffsBeforeSkin/numNerfsBeforeSkin / uniqueBuffNerfRatio))
print()
print("Buffs before skin: " + str(buffBeforeSkin))
print("Nerfs before skin: " + str(nerfBeforeSkin))
print("Adjustments before skin: " + str(adjBeforeSkin))

# allBuffs = []
# allNerfs = []
# allAdjustments = []
# for patch in Buffs:
#     allBuffs.extend(patch)
# for patch in Nerfs:
#     allNerfs.extend(patch)
# for patch in Adjustments:
#     allAdjustments.extend(patch)
# numBuffsPerChamp, countBuffs = np.unique(allBuffs, return_counts=True)
# numNerfsPerChamp, countNerfs = np.unique(allNerfs, return_counts=True)
# count_sorted_buffs = np.argsort(-countBuffs)
# count_sorted_nerfs = np.argsort(-countNerfs)
# print("Buffs per champ: " + str(numBuffsPerChamp[count_sorted_buffs])+str(countBuffs[count_sorted_buffs]))
# print("Nerfs per champ: " + str(numNerfsPerChamp[count_sorted_nerfs])+str(countNerfs[count_sorted_nerfs]))
