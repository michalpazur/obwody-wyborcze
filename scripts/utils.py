from pandas import DataFrame

def head(df: DataFrame, n: int = 5):
  print(df.head(n))

def capitalize(x):
  return x[:1].upper() + x[1:]

def load_replacements():
  with open("const/street_replacements.csv") as replacements_file:
    replacements = [line.strip().split(";") for line in replacements_file.readlines()]
    replacements = dict(zip([x[0] for x in replacements], [x[1] for x in replacements]))
  return replacements