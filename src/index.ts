declare global {
    interface Object {
        pushStat(key: string, value: string): void;
    }
}

import "./index.scss";

import $ from "jquery";
import * as PapaParse from "papaparse";
import Swal from "sweetalert2";

let statsList: IStat[] = [];

console.log("The main script is running.");

Object.prototype.pushStat = function (this: IStat, key, value) {
    this[key] = value;
    if (value) $("#statDisplayer").append(`<div><b>${key}</b>: ${value}</div>`);
};

interface IStat {
    [key: string]: string;
}

function error(message: string) {
    $("#log").css("font-size", "1.5em").text(`ERR: ${message}`);
}

async function getUserStats(username: string) {
    const stats: IStat = {};

    const $hr = $("<hr />");
    const $fetching = $("<span>Fetching...</span>");
    $("#ign").val("");
    $("#submitBtn").prop("disabled", true);
    $("#exportBtn").prop("disabled", true);

    $("#statDisplayer").append($hr);
    $("#statDisplayer").append($fetching);

    const response = await fetch(`https://api.slothpixel.me/api/players/${username}`);
    const stat = await response.json();
    const bedwarsStat = stat.stats?.BedWars;
    $("#submitBtn").prop("disabled", false);
    $("#exportBtn").prop("disabled", false);
    $fetching.remove();
    if (stat.error) {
        $hr.remove();
        error(stat.error);
    } else if (bedwarsStat.games_played < 1) {
        $hr.remove();
        error("This player doesn't play bedwars.");
    } else {
        stats.pushStat("Username", stat.username);
        stats.pushStat("Rank", stat.rank_formatted.replace(/&[0-9a-fl-or]/gi, ""));
        stats.pushStat("Bedwars Level", bedwarsStat.level);
        stats.pushStat("Games Played", bedwarsStat.games_played);
        stats.pushStat("Wins", bedwarsStat.wins);
        stats.pushStat("Losses", bedwarsStat.losses);
        stats.pushStat("Kills", bedwarsStat.kills);
        stats.pushStat("Deaths", bedwarsStat.deaths);
        stats.pushStat("Final Kills", bedwarsStat.final_kills);
        stats.pushStat("Final Deaths", bedwarsStat.final_deaths);
        stats.pushStat("Beds Broken", bedwarsStat.beds_broken);
        stats.pushStat("WLR", bedwarsStat.w_l);
        stats.pushStat("KDR", bedwarsStat.k_d);
        stats.pushStat("FKDR", bedwarsStat.final_k_d);
        stats.pushStat("BBLR", bedwarsStat.bed_ratio);

        statsList.push(stats);
    }
}

$(() => {
    $("#ign").on("keypress", (event) => {
        if (event.key === "Enter") {
            if (!$("#submitBtn").is(":disabled")) $("#submitBtn").trigger("click");
        }
    });

    $("#submitBtn").on("click", (event) => {
        const username = $("#ign").val() as string | undefined;
        if (username) {
            getUserStats(username);
        } else {
            error("You forgot to enter the username!");
        }
    });

    $("#exportBtn").on("click", (event) => {
        const csv = PapaParse.unparse(statsList);
        $("body").append(`<pre>${csv}</pre>`);
        const download = $("<a></a>");
        download.attr("href", `data:text/plain;charset=utf-8,${encodeURIComponent(csv)}`);
        download.attr("download", "stats.csv");
        $("body").append(download);
        download[0].click();
    });
});
