var gobang = document.getElementById('go');
var context = gobang.getContext('2d');
// 设置背景
context.strokeStyle = "#000";
var logo = new Image();
logo.src = "image/muwen.jpg";
logo.onload = function () {
	context.drawImage(logo, 0, 0, 450, 450);
	drawChessBoard();
}

// 利用循环画棋盘
var drawChessBoard = function () {
	for (var i = 0; i < 15; i++) {
		context.moveTo(15 + i * 30, 15);
		context.lineTo(15 + i * 30, 435);
		context.stroke();
		context.moveTo(15, 15 + i * 30);
		context.lineTo(435, 15 + i * 30);
		context.stroke();
	}
}

// 绘制棋子
var oneStep = function (i, j, chess) {
	context.beginPath();
	context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
	if (chess) {
		gradient.addColorStop(0, "#0A0A0A");
		gradient.addColorStop(1, "#636766");
	}
	else {
		gradient.addColorStop(0, "#D1D1D1");
		gradient.addColorStop(1, "#F9F9F9");
	}
	context.fillStyle = gradient;
	context.fill();

}

var GobangBoard = [];
// 鼠标落子
gobang.onclick = function (e) {
	if (over) {
		return;
	}
	if (!gobang) {
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30); //Math.floor向下取整
	var j = Math.floor(y / 30);
	if (GobangBoard[i][j] == 0) {
		oneStep(i, j, gobang);
		GobangBoard[i][j] = 1;

		for (var k = 0; k < count; k++) {
			if (wins[i][j][k]) {
				myWin[k]++;
				computerWin[k] = 6;
				if (myWin[k] == 5) {
					window.alert("您赢了!")
					over = true;
				}
			}
		}
		if (!over) {
			gobang = !gobang;
			computerAI();
		}
	}

}



var gobang = true;
var over = false;
//赢法数组
var wins = [];

//赢法统计数组
var myWin = [];
var computerWin = [];


for (var i = 0; i < 15; i++) {
	GobangBoard[i] = [];
	for (var j = 0; j < 15; j++) {
		GobangBoard[i][j] = 0;
	}
}

for (var i = 0; i < 15; i++) {
	wins[i] = [];
	for (var j = 0; j < 15; j++) {
		wins[i][j] = [];
	}
}

var count = 0;

//横线
for (var i = 0; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[i][j + k][count] = true;
		}
		count++;
	}
}
//竖线
for (var i = 0; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[j + k][i][count] = true;
		}
		count++;
	}
}
//斜线
for (var i = 0; i < 11; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[i + k][j + k][count] = true;
		}
		count++;
	}
}
//反斜线
for (var i = 0; i < 11; i++) {
	for (var j = 14; j > 3; j--) {
		for (var k = 0; k < 5; k++) {
			wins[i + k][j - k][count] = true;
		}
		count++;
	}
}


for (var i = 0; i < count; i++) {
	myWin[i] = 0;
	computerWin[i] = 0;
}




var computerAI = function () {
	var myScore = [];
	var computerScore = [];
	var max = 0;
	var u = 0, v = 0;
	for (var i = 0; i < 15; i++) {
		myScore[i] = [];
		computerScore[i] = [];
		for (var j = 0; j < 15; j++) {
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			if (GobangBoard[i][j] == 0) {
				for (var k = 0; k < count; k++) {
					if (wins[i][j][k]) {
						if (myWin[k] == 1) {
							myScore[i][j] += 200;
						}
						else if (myWin[k] == 2) {
							myScore[i][j] += 400;
						}
						else if (myWin[k] == 3) {
							myScore[i][j] += 2000;
						}
						else if (myWin[k] == 4) {
							myScore[i][j] += 10000;
						}

						if (computerWin[k] == 1) {
							computerScore[i][j] += 220;
						}
						else if (computerWin[k] == 2) {
							computerScore[i][j] += 420;
						}
						else if (computerWin[k] == 3) {
							computerScore[i][j] += 2100;
						}
						else if (computerWin[k] == 4) {
							computerScore[i][j] += 20000;
						}
					}
				}
				if (myScore[i][j] > max) {
					max = myScore[i][j];
					u = i;
					v = j;
				}
				else if (myScore[i][j] == max) {
					if (computerScore[i][j] > computerScore[u][v]) {
						u = i;
						v = j;
					}
				}

				if (computerScore[i][j] > max) {
					max = computerScore[i][j];
					u = i;
					v = j;
				}
				else if (computerScore[i][j] == max) {
					if (myScore[i][j] > myScore[u][v]) {
						u = i;
						v = j;
					}
				}
			}
		}
	}
	oneStep(u, v, false);
	GobangBoard[u][v] = 2;

	for (var k = 0; k < count; k++) {
		if (wins[u][v][k]) {
			computerWin[k]++;
			myWin[k] = 6;
			if (computerWin[k] == 5) {
				window.alert("您输了!")
				over = true;
			}
		}
	}
	if (!over) {
		gobang = !gobang;
	}
}