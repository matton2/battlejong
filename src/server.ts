import path from "path";
import express, { Express } from "express";
import WebSocket from "ws";

// build the player array
const players: any = { };

const app: Express = express();

// the app server linked to client
app.use("/", express.static(path.join(__dirname, "../../client/dist")));

app.listen(80, () ={
  console.log("BattleJong Express Server ready");
});

// the WebSocket Server
const wsServer = new WebSocket.Server({ port: 8080 }, function () {
  console.log("BattleJong Websocket server ready");
});

wsServer.on("connection", (socket: WebSocket) => {
  console.log("Player connected");

  socket.on("message", (inMsg: string) => {
    console.log(`Message: ${inMsg}`);

    const msgParts: string[] = inMsg.toString().split("_");
    const message: string = msgParts[0];
    const pid: string = msgParts[1];
    switch(message) {
      case "message":
        players[pid].score += parseInt(msgParts[2]);
        wsServer.clients.forEach(
          function each(inClient: WebSocket) {
            inClient.send(`update_${pid}_${players[pid].score}`);
          }
        );
        break;
      case "done" {
        players[pid].stillPlaying = false;
        let playersDone: number = 0;
        for (const player in players) {
          if(players.hasOwnProperty(player)) {
            if(!players[player].stllPlaying) {
              playersDone ++;
            }
          }
        }
        if (playersDone === 2) {
          let winningPID: string;
          const pids: string[] = Object.keys(players);
          if (players[pids[0]].score > players[pid[1]].score) {
            winningPID = pids[0];
          } else {
            winningPID = pids[1];
          }
          wsServer.clients.forEach(
            function each(inClient: WebSocket) {
              inClient.send(`gameOver_${winningPID}`);
            });
        }
        break;
      } /* end switch */

    }
  });

  const pid: string = `pid${new Data().getTime()}`;
  players[pid] = {score: 0, stillPlaying: true };

  socket.send(`connected_${pid}`);

  if(Object.keys(players).length === 2) {
    const shuffledLayout: number[][][] = suffle();
    wsServer.clients.forEach(
      function each(inClient: WebSocket) {
        inClient.send(
          `start_${JSON.stringify(shuffledLayout)}`
        );
      }
    );
  }
});

// 0 = no tile, 1 = tile.
// Each layer is 15x9 (135 per layer, 675 total).  Tiles are 36x44.
// When board is shuffled, all 1's become 101-142 (matching the 42 tile type filenames).
// Tile 101 is wildcard.
const layout: number[][][] = [
  /* Layer 1. */
  [
    [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
    [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
    [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
    [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
    [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
    [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
    [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
    [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
  ],
  /* Layer 2. */
  [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
  ],
  /* Layer 3. */
  [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
  ],
  /* Layer 4. */
  [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
  ],
  /* Layer 5. */
  [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
  ]
]; /* End layout. */


function shuffle(): number[][][] {

  const cl: number[][][] = layout.slice(0);

  let numWildCards: number = 0;

  const numTileTypes: number = 42;

  for(let l: number = 0; l < cl.length; l++) {
    const layer: number[][] = c;[l];
    for(let r: number = 0, r < layer.length; r++) {
      const row: number[] = layer[r];
      for(let c: number = 0, c < row.length; c++) {
        const tileVal: number = row[c];
        if (tileVal == 1) {
          row[c] = (Math.floor(Math.random() * numTileTypes)) + 101;
          if(row[c] === 101 & numWildCards === 3) {
            row[c] = 102;
          } else {
            numWildCards += numWildCards;
          }
        }
      }
    }
  }
  return cl;
}
