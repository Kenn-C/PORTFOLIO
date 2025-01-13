from dash import dcc, html, Input, Output
import dash
import dash_bootstrap_components as dbc
import requests
import random
import pytz
from datetime import datetime
import pandas as pd
import plotly.express as px
import random
from collections import defaultdict


historical_rates = defaultdict(list)

# Initialize Dash App with Bootstrap for styling
app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])
app.title = "Live Currency Exchange Dashboard"
app.config.suppress_callback_exceptions = True

# API Endpoint for Currency Rates
API_URL = "https://open.er-api.com/v6/latest"

# Country and Currency Mapping (Partial List)
COUNTRY_CURRENCY_MAPPING = {
    "USD": "United States Dollar",
    "EUR": "Eurozone Euro",
    "GBP": "United Kingdom Pound",
    "JPY": "Japan Yen",
    "CAD": "Canada Dollar",
    "AUD": "Australia Dollar",
    "INR": "India Rupee",
    "CNY": "China Yuan",
    "CHF": "Switzerland Franc",
    "ZAR": "South Africa Rand",
    "PHP": "Philippine Peso",
    "TRY": "Turkish Lira",
}

# Layout
app.layout = dbc.Container([
    dbc.Row([
        dbc.Col([
            html.Div([
                html.H2("Navigation", style={'color': '#C0C8CA', 'textAlign': 'center'}),
                html.Button("Home", id="nav-home", n_clicks=0, style={
                    'width': '100%', 'padding': '10px', 'margin-bottom': '10px',
                    'background-color': '#243B55', 'color': '#C0C8CA', 'border': 'none'
                }),
                html.Button("Live Exchange", id="nav-exchange", n_clicks=0, style={
                    'width': '100%', 'padding': '10px', 'margin-bottom': '10px',
                    'background-color': '#243B55', 'color': '#C0C8CA', 'border': 'none'
                }),
                html.Button("Monthly Rates", id="nav-monthly", n_clicks=0, style={
                    'width': '100%', 'padding': '10px', 'margin-bottom': '10px',
                    'background-color': '#243B55', 'color': '#C0C8CA', 'border': 'none'
                }),
            ], style={'background-color': '#0D1B2A', 'height': '100vh', 'padding': '20px'})
        ], width=2),
        dbc.Col([
            html.Div(id='main-content', style={'margin-top': '20px'}),
        ], width=10),
    ]),
    dcc.Interval(id='interval-component', interval=1000, n_intervals=0)
], fluid=True, style={'background-color': '#0D1B2A'})


# Content Layouts
import pytz
from datetime import datetime

def home_layout():
    return html.Div([
        html.H1("Welcome to the USD Currency Exchange Dashboard", 
                style={'color': '#C0C8CA', 'textAlign': 'center', 'margin-bottom': '20px'}),
        html.P("Use the navigation to explore live rates and monthly trends.",
               style={'color': '#AAB7B7', 'textAlign': 'center', 'margin-bottom': '40px'}),
        html.H3("Global Time Zones", 
                style={'color': '#C0C8CA', 'textAlign': 'center', 'margin-bottom': '20px'}),
        # Grid for time zones
        html.Div(id='live-time-grid', style={
            'display': 'grid',
            'grid-template-columns': 'repeat(auto-fit, minmax(200px, 1fr))',
            'gap': '20px',
            'padding': '20px',
            'background-color': '#1B263B',
            'border-radius': '10px',
        }),
        # Interval for updating time every second
        dcc.Interval(id='time-interval', interval=1000, n_intervals=0)
    ], style={'background-color': '#0D1B2A', 'padding': '20px'})

    
@app.callback(
    Output('live-time-grid', 'children'),
    Input('time-interval', 'n_intervals')
)
def update_live_time(n_intervals):
    # Time zones to display
    time_zones = [
        "UTC", "US/Eastern", "US/Central", "US/Mountain", "US/Pacific",
        "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow",
        "Asia/Tokyo", "Asia/Shanghai", "Asia/Kolkata", "Asia/Dubai",
        "Australia/Sydney", "Australia/Perth", "Africa/Johannesburg",
        "Africa/Cairo", "America/Sao_Paulo", "America/Mexico_City",
        "America/Buenos_Aires", "America/Vancouver",
        "America/Toronto", "Pacific/Auckland", "Pacific/Honolulu"
    ]
    
    # Fetch the current time for each time zone
    time_list = []
    for tz in time_zones:
        now = datetime.now(pytz.timezone(tz))
        time_list.append(html.Div([
            html.H4(f"{tz}", style={'color': '#FFD700', 'text-align': 'center', 'margin-bottom': '10px'}),
            html.P(f"{now.strftime('%Y-%m-%d %H:%M:%S')}", 
                   style={'color': '#FFFFFF', 'text-align': 'center', 'font-size': '18px', 'margin': '0'})
        ], style={
            'padding': '20px',
            'background-color': '#243B55',
            'border-radius': '10px',
            'box-shadow': '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }))
    return time_list





def live_exchange_layout():
    return html.Div([
        dbc.Row([
            dbc.Col([
                dcc.Dropdown(
                    id='base-currency',
                    options=[],
                    placeholder="Select Base Currency",
                    style={
                        'margin-bottom': '10px',
                        'background-color': '#243B55',
                        'color': '#C0C8CA',
                        'border-radius': '5px',
                        'width': '100%'
                    },
                ),
                dcc.Dropdown(
                    id='target-currency',
                    options=[],
                    placeholder="Select Target Currency",
                    style={
                        'margin-bottom': '20px',
                        'background-color': '#243B55',
                        'color': '#C0C8CA',
                        'border-radius': '5px',
                        'width': '100%'
                    }
                ),
                html.Div([
                    dcc.Input(
                        id='amount',
                        type='number',
                        placeholder="Enter Amount",
                        style={
                            'margin-bottom': '10px',
                            'background-color': '#243B55',
                            'color': '#C0C8CA',
                            'padding': '10px',
                            'border-radius': '5px',
                            'width': '100%'
                        }
                    ),
                    html.Div(id='conversion-result', style={
                        'color': '#C0C8CA',
                        'textAlign': 'center',
                        'margin-top': '10px',
                        'font-size': '18px',
                        'font-weight': 'bold'
                    })
                ], style={'margin-bottom': '20px'}),
            ], width=12),
        ]),
        html.H3("Global Currency Rates", style={'color': '#C0C8CA', 'textAlign': 'center', 'margin-bottom': '20px'}),
        html.Div([
            html.Div([
                html.Div("Currency", style={'font-weight': 'bold', 'color': '#FFD700', 'text-align': 'left'}),
                html.Div("Rate", style={'font-weight': 'bold', 'color': '#FFD700', 'text-align': 'right'}),
            ], style={
                'display': 'grid',
                'grid-template-columns': '1fr 1fr',
                'padding': '10px',
                'background-color': '#243B55',
                'border-bottom': '2px solid #1B263B',
            }),
            html.Div(id='global-currency-list', style={
                'color': '#C0C8CA',
                'overflow-y': 'scroll',
                'height': '500px',
                'padding': '10px',
                'background-color': '#1B263B',
                'border-radius': '10px',
                'font-size': '18px',
                'text-align': 'left',
            }),
        ], style={'padding': '10px'}),
    ])





def monthly_rates_layout():
    return html.Div([
        html.H3("Monthly Exchange Rate Trends", 
                style={'color': '#C0C8CA', 'textAlign': 'center', 'margin-bottom': '20px'}),
        dcc.Graph(
            id='monthly-rates-line-bar-graph',
            style={'background-color': '#1B263B', 'border-radius': '10px'}
        ),
        html.Div([
            dcc.Dropdown(
                id='currency-selection',
                options=[{'label': v, 'value': k} for k, v in COUNTRY_CURRENCY_MAPPING.items()],
                placeholder="Select Currency",
                style={
                    'margin': '0 auto',
                    'width': '60%',
                    'background-color': '#243B55',
                    'color': '#C0C8CA',
                    'border-radius': '5px',
                    'textAlign': 'center',
                },
            ),
        ], style={'display': 'flex', 'justify-content': 'center', 'margin-bottom': '20px'}),
        html.Div([
            dcc.RadioItems(
                id='time-range-selection',
                options=[
                    {'label': '7 Days', 'value': 7},
                    {'label': '15 Days', 'value': 15},
                    {'label': '30 Days', 'value': 30}
                ],
                value=30,
                labelStyle={
                    'display': 'inline-block',
                    'margin': '10px',
                    'color': '#C0C8CA',
                    'font-weight': 'bold'
                },
            ),
        ], style={'textAlign': 'center'}),
        dcc.Interval(id='monthly-update-interval', interval=1000, n_intervals=0),  # Update every 1 second
    ], style={
        'background-color': '#0D1B2A', 
        'padding': '20px', 
        'border-radius': '10px'
    })




@app.callback(
    Output('monthly-rates-line-bar-graph', 'figure'),
    [
        Input('currency-selection', 'value'),
        Input('monthly-update-interval', 'n_intervals'),
    ]
)
def update_infinite_graph(selected_currency, n_intervals):
    if not selected_currency:
        return px.line(
            title="Please select a currency to view live fluctuations",
            labels={'x': 'Time', 'y': 'Rate'}
        )

    try:
        # Fetch rate from  API
        response = requests.get(f"{API_URL}/USD")
        data = response.json()
        rates = data.get('rates', {})
        base_rate = rates.get(selected_currency)

        if not base_rate:
            return px.line(
                title=f"Rate for {selected_currency} not available.",
                labels={'x': 'Time', 'y': 'Rate'}
            )

        # Simulate live fluctuations
        fluctuated_rate = base_rate + random.uniform(-0.05, 0.05)

        # Update historical
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        historical_rates[selected_currency].append({'time': now, 'rate': fluctuated_rate})

        # Create DataFrame
        df = pd.DataFrame(historical_rates[selected_currency])

        fig = px.line(
            df,
            x='time',
            y='rate',
            title=f"Live Exchange Rate for {COUNTRY_CURRENCY_MAPPING[selected_currency]} (USD)",
            labels={'time': 'Time', 'rate': 'Rate'},
        )

        fig.update_layout(
            paper_bgcolor='#1B263B',
            plot_bgcolor='#1B263B',
            font_color='#C0C8CA',
            xaxis=dict(title_font=dict(size=14), tickangle=45),
            yaxis=dict(title_font=dict(size=14)),
            showlegend=False,
        )
        fig.update_traces(
            line=dict(color='#FFD700', width=2),
            marker=dict(size=4, color='#FFD700', symbol='circle')
        )
        return fig

    except Exception as e:
        return px.line(title=f"Error fetching data: {str(e)}")








# Callbacks
@app.callback(
    Output('main-content', 'children'),
    [Input('nav-home', 'n_clicks'),
     Input('nav-exchange', 'n_clicks'),
     Input('nav-monthly', 'n_clicks')]
)
def update_main_content(home_clicks, exchange_clicks, monthly_clicks):
    ctx = dash.callback_context
    if not ctx.triggered:
        return home_layout()
    button_id = ctx.triggered[0]['prop_id'].split('.')[0]
    if button_id == 'nav-home':
        return home_layout()
    elif button_id == 'nav-exchange':
        return live_exchange_layout()
    elif button_id == 'nav-monthly':
        return monthly_rates_layout()
    return home_layout()


@app.callback(
    [Output('global-currency-list', 'children'),
     Output('base-currency', 'options'),
     Output('target-currency', 'options')],
    [Input('interval-component', 'n_intervals')]
)
def update_global_currency_list(n):
    try:
        response = requests.get(f"{API_URL}/USD")
        data = response.json()
        rates = data.get('rates', {})
        fluctuating_rates = {
            currency: rate + random.uniform(-0.05, 0.05) for currency, rate in rates.items()
        }
        sorted_rates = sorted(fluctuating_rates.items(), key=lambda x: x[1], reverse=False)
        rate_elements = []
        for idx, (currency, rate) in enumerate(sorted_rates):
            row_style = {
                'display': 'grid',
                'grid-template-columns': '1fr 1fr',
                'padding': '10px',
                'background-color': '#243B55' if idx % 2 == 0 else '#1B263B',
                'border-bottom': '1px solid #1B263B',
                'border-radius': '5px',
            }
            rate_elements.append(html.Div([
                html.Div(f"{COUNTRY_CURRENCY_MAPPING.get(currency, currency)} ({currency})", 
                         style={'text-align': 'left', 'font-weight': 'bold'}),
                html.Div(f"{round(rate, 2)}", style={'text-align': 'right'}),
            ], style=row_style))
        options = [{'label': f"{COUNTRY_CURRENCY_MAPPING.get(currency, currency)} ({currency})", 'value': currency}
                   for currency in rates.keys()]
        return rate_elements, options, options
    except Exception as e:
        return [html.P(f"Error fetching data: {str(e)}", style={'color': 'red'})], [], []



@app.callback(
    Output('conversion-result', 'children'),
    [Input('base-currency', 'value'),
     Input('target-currency', 'value'),
     Input('amount', 'value')]
)
def convert_currency(base_currency, target_currency, amount):
    if not base_currency or not target_currency or not amount:
        return "Please select currencies and enter an amount."
    if base_currency == target_currency:
        return f"{amount} {base_currency} = {amount} {target_currency}"
    try:
        response = requests.get(f"{API_URL}/{base_currency}")
        data = response.json()
        rate = data.get('rates', {}).get(target_currency)
        if rate:
            converted_amount = round(amount * rate, 2)
            return f"{amount} {base_currency} = {converted_amount} {target_currency}"
        return "Conversion rate not available."
    except Exception as e:
        return f"Error converting currency: {str(e)}"


if __name__ == '__main__':
    app.run_server(debug=True)
