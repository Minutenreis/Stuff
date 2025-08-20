# Lolalytics Algorithm for Delta2

def expectedWR(wr1, wr2):
  return (wr1-wr1*wr2)/(wr1+wr2-2*wr1*wr2)


def delta2(wr1, wr2, wr1vs2, avgWR):
  diff = avgWR - 0.5
  wr1vs2 = wr1vs2-diff
  wr1 = wr1-diff
  wr2 = wr2-diff
  return wr1vs2-expectedWR(wr1, wr2)


def delta2_percent(wr1, wr2, wr1vs2, avgWR):
  wr1 = wr1/100
  wr2 = wr2/100
  wr1vs2 = wr1vs2/100
  avgWR = avgWR/100
  return delta2(wr1, wr2, wr1vs2, avgWR) * 100

# Example:
# 15.15, E+
# Olaf Top WR: 51.12%
# Renekton Top WR: 49.4%
# Olaf vs Renekton WR: 50.79%
# Average WR: 49.92%


print(delta2_percent(51.12, 49.4, 50.79, 49.92))  # -0.8495707951295506

# Lolalytics Delta2: -0.85
