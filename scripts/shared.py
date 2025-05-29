from pandas import DataFrame

def head(df: DataFrame, n: int = 5):
  print(df.head(n))

def capitalize(x):
  return x[:1].upper() + x[1:]