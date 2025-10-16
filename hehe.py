import dash
from dash import dcc, html
import plotly.express as px
import pandas as pd

df = pd.DataFrame({
    "X": range(10),
    "Y": [i**2 for i in range(10)]
})

app = dash.Dash(__name__)

app.layout = html.Div([
    html.H1("Dash Dashboard"),
    dcc.Graph(
        figure=px.line(df, x="X", y="Y", title="Y = X^2")
    )
])

if __name__ == "__main__":
    app.run_server(debug=True)