
async function checkValue() {
    const output = document.getElementById("output");
    output.innerHTML = "🔄 Daten werden geladen...";

    const response = await fetch("https://v3.football.api-sports.io/fixtures?live=all", {
        method: "GET",
        headers: {
            "x-apisports-key": API_KEY
        }
    });
    const data = await response.json();

    if (!data.response || data.response.length === 0) {
        output.innerHTML = "⚠️ Keine Live-Spiele verfügbar.";
        return;
    }

    let result = "";
    let alarmTriggered = false;

    for (const game of data.response) {
        const minute = game.fixture.status.elapsed || 0;
        const home = game.teams.home.name;
        const away = game.teams.away.name;
        const goals = game.goals.home + game.goals.away;

        const shots = 12; // TODO: Live-Daten integrieren
        const possession = 60; // TODO: Live-Daten integrieren
        const bookmaker_quote = 2.10;
        const faire_quote = 1.75;

        const value_bet = bookmaker_quote > faire_quote;

        if (minute >= 60 && goals <= 1 && shots >= 10 && possession >= 55 && value_bet) {
            result += `<div><strong>${home} vs. ${away}</strong><br>Minute: ${minute}'<br>Stand: ${game.goals.home} - ${game.goals.away}<br><span class='alarm'>🔥 VALUE erkannt – Wette auf Ü2.5</span></div><hr>`;
            alarmTriggered = true;
        }
    }

    output.innerHTML = alarmTriggered ? result : "📉 Kein Value-Spiel gefunden – weiter scannen...";
}
