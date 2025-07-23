P = 0.005
pity = 80

expected = 0
RPPerPull = 400
RPPerEuro = 130
for i in range(1, pity):
  expected += i * P * (1-P) ** (i-1)
expected += (1 - P) ** (pity - 1) * pity
print("Expected #Pulls:", expected)
print("Expected Cost:  ", expected * RPPerPull / RPPerEuro, "Euro")
