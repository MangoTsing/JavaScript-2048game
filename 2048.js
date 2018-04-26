/*
	author:sgyp 18/4/22
*/

var sgypGame = {
	start: function() {
		this.data = new Array();
		for (var i = 0; i < this.Heng; i++) {
			this.data[i] = [];
			for (var j = 0; j < this.Shu; this.data[i][j] = 0, j++);
		} //将data做一个4*4矩阵数组
		this.someNextNum();
		//获取随机数
		this.someNextNum();
		this.resetFlex();
		//先运行一次resetflex，渲染页面，再绑定事件
		document.addEventListener('keydown', (e) => {
			switch (e.keyCode) { //差点忘了break，switch不带break全执行了
				case 37:
					this.goLeft();
					break;
				case 38:
					this.goTop();
					break;
				case 39:
					this.goRight();
					break;
				case 40:
					this.goBottom();
					break;
			}
		}); //添加键盘事件监听,上下左右箭头
		document.addEventListener('mousedown', this.Logic, false); //鼠标滑动效果监听
		document.getElementById('container').addEventListener('touchstart', function(event) {　
			event.preventDefault(); //阻止滚动
			　　　
			startX = event.touches[0].pageX;　　　
			startY = event.touches[0].pageY;

			//获取起始值
		});
		document.getElementById('container').addEventListener('touchend', function(event) {
			event.preventDefault();　　　　
			moveEndX = event.changedTouches[0].pageX;　　　　
			moveEndY = event.changedTouches[0].pageY;　　　　
			X = moveEndX - startX;　　　　
			Y = moveEndY - startY;

			　
			if (Math.abs(X) > Math.abs(Y) && X > 0) {
				sgypGame.goRight();　　　　
			}　　　　
			else if (Math.abs(X) > Math.abs(Y) && X < 0) {　　　　　　
				sgypGame.goLeft();　　　　
			}　　　　
			else if (Math.abs(Y) > Math.abs(X) && Y > 0) {　　　　　　
				sgypGame.goBottom();　　　　
			}　　　　
			else if (Math.abs(Y) > Math.abs(X) && Y < 0) {　　　　　　
				sgypGame.goTop();　　　　
			}　　　　
			else {　　　　　　 //暂停游戏
				alert('暂停游戏，可以追加计时器实现限时排名2048功能')
				document.getElementById('container').style.display = "none";
				document.getElementById('peace').style.display = "block";
				document.getElementById('peace').addEventListener('click', function() {
					document.getElementById('container').style.display = "flex";
					document.getElementById('peace').style.display = "none";
				})　　　　
			}
		});


	},
	//move->移动模块
	move: function(callback) {
		var move1 = String(this.data); //把数组字符串化，进行操作
		callback(); //进行一次回调函数，用arrow function，this指向最近的对象,匿名函数回调指向window对象
		var move2 = String(this.data);
		if (move1 != move2) {
			this.someNextNum(); //如果有改变，进行下一个随机块的生成

			if (!this.gameOver()) { //判断游戏是否结束
				this.state = 0;
			}
			this.resetFlex();
		}
	},
	//resetFlex->重新更新视图模块
	resetFlex: function() {

		for (var i = 0; i < this.Heng; i++) {
			for (var j = 0; j < this.Shu; j++) {

				var oDiv = document.getElementById("item" + i + j);

				if (this.data[i][j] != 0) {
					oDiv.innerHTML = this.data[i][j];
					oDiv.className = "item n" + this.data[i][j]

				} else { //否则
					oDiv.innerHTML = "";
					oDiv.className = "item n0";
				}
			}
		}
		//找到id为score的元素，设置其内容为score属性
		document.getElementById("score").innerHTML = "分数：" + this.score;
		//如果游戏状态为结束
		if (this.state == 0) {
			document.getElementById("gameover").style.display = "block";
			document.getElementById("final").innerHTML = '最终得分：' + this.score;
			document.getElementById('container').style.display = "none";
		} else {
			document.getElementById("gameover").style.display = "none";

		}
	},
	//Logic->鼠标滑动模块
	Logic: function(event) {
		var e = event || window.event;
		var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
		var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
		var x = e.pageX || e.clientX + scrollX;
		var y = e.pageY || e.clientY + scrollY;
		document.onmouseup = function(event) {
			var e = event || window.event;
			var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
			var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
			var x1 = e.pageX || e.clientX + scrollX;
			var y1 = e.pageY || e.clientY + scrollY;
			if (Math.abs(x - x1) > Math.abs(y - y1) && (x - x1) < 0) {
				sgypGame.goRight();
				//以上右滑
			} else if (Math.abs(x - x1) > Math.abs(y - y1) && (x - x1) > 0) {
				sgypGame.goLeft();
			} else if (Math.abs(x - x1) < Math.abs(y - y1) && (y - y1) < 0) {
				sgypGame.goBottom();
			} else if (Math.abs(x - x1) < Math.abs(y - y1) && (y - y1) > 0) {
				sgypGame.goTop();
			}
		};
	},
	//gameOver->判断游戏结束模块
	gameOver: function() {
		for (var h = 0; h < this.Heng; h++) {
			for (var s = 0; s < this.Shu; s++) { //双重嵌套最为致命
				//每个格子都在判断，除了最边上的格子，只要能想加
				if (this.data[h][s] == 0) {
					return true;
					//还有空格子
				} else if (s < this.Shu - 1 && this.data[h][s] == this.data[h][s + 1]) {
					return true;
					//没空格子，但还有能相加的相邻格子
				} else if (h < this.Heng - 1 && this.data[h][s] == this.data[h + 1][s]) {
					return true;
					//同上
				}
			}
		}
		//双重嵌套都没找到能运行的块块,返回false
		return false;
	},
	//刷新格子模块
	someNextNum: function() {
		//算出随机数,如果随机的格子为空，赋值
		var h = Math.floor(Math.random() * (this.Heng));
		var s = Math.floor(Math.random() * (this.Shu));
		if (this.data[h][s] == 0) {
			if (Math.round(Math.random())) {
				this.data[h][s] = 2;
			} else {
				this.data[h][s] = 4;
			}
		} else if (this.data[h][s] !== 0) {
			this.someNextNum();
			//如果不为0再求一次，直到为空格子
		}
	},
	//向左
	goLeft: function() {
		this.move(() => {
			for (var i = 0; i < this.Heng; i++) {
				this.goLeftNext(i); //每一行进行循环,寻找有块块的替换赋值
			}
		});
	},
	//操作模块
	goLeftNext: function(h) {
		for (var s = 0; s < this.Shu - 1; s++) {
			var nextShu = this.getLeftNext(h, s); //获取本行下一个块块（for循环判断是否存在）
			if (nextShu == -1) {
				break;
			} //如果没有下一个块块，就不用判断了。
			else {
				if (this.data[h][s] == 0) {
					this.data[h][s] = this.data[h][nextShu]; //将有下一个值的块，复制给没有值的当前块
					this.data[h][nextShu] = 0; //将下一个块块清空
					s--; //将s参数减一，重新计算下一个块是否有值
				} else if (this.data[h][s] ==
					this.data[h][nextShu]) { //如果这个块和下一个有值块相等
					this.data[h][s] = this.data[h][s] * 2; //乘2
					this.score += this.data[h][s]; //把值加上score里
					this.data[h][nextShu] = 0; //清空
				}
			}
		}
	},
	//获取下一个块，return跳出循环
	getLeftNext: function(h, s) {
		//看看这一行有没有下一个块，有就返回有块的块数，否则-1
		s++;
		for (; s < this.Shu; s++) {
			if (this.data[h][s] != 0) { //如果这个块块不为0，返回，横的值
				return s;
			}
		}
		return -1;
	},
	goRight: function() {
		this.move(() => {
			for (let h = 0; h < this.Heng; h++) {
				this.goRightNext(h); //每一行都进行操作
			}
		});
	},
	goRightNext: function(h) { //本行下一个块，赋值替换操作
		for (var s = this.Shu - 1; s > 0; s--) { //从最大值开始递减，有块就操作，没块就赋值
			var prevShu = this.getRightNext(h, s); //从2开始判断到0，最右侧不用管
			if (prevShu == -1) {
				break;
			} //没有块块就最好啦！！
			else {
				if (this.data[h][s] == 0) {
					this.data[h][s] = this.data[h][prevShu];
					this.data[h][prevShu] = 0;
					s++;
					//当右边的块为空把下个块赋值过去，并且把s参数加1，重复计算
				} else if (this.data[h][s] == this.data[h][prevShu]) {
					this.data[h][s] *= 2;
					this.score += this.data[h][s];
					this.data[h][prevShu] = 0;
					//相等情况，加分并且赋值
				}
			}
		}
	},
	getRightNext: function(h, s) {
		s--;
		for (; s >= 0; s--) {
			if (this.data[h][s] != 0) {
				return s;
			}
		}
		return -1;
	},
	goTop: function() {
		this.move(() => {
			for (var s = 0; s < this.Shu; s++) {
				this.goTopNext(s);
			}
		});
	},
	goTopNext: function(s) {
		for (var h = 0; h < this.Heng - 1; h++) { //和上面差不多，改为从纵向判断
			var nextHeng = this.getTopNext(h, s);
			if (nextHeng == -1) {
				break;
			} else {
				if (this.data[h][s] == 0) {
					this.data[h][s] = this.data[nextHeng][s];
					this.data[nextHeng][s] = 0;
					h--;
				} else if (this.data[h][s] ==
					this.data[nextHeng][s]) {
					this.data[h][s] *= 2;
					this.score += this.data[h][s];
					this.data[nextHeng][s] = 0;
				}
			}
		}
	},
	getTopNext: function(h, s) {
		h++;
		for (; h < this.Heng; h++) {
			if (this.data[h][s] != 0) {
				return h;
			}
		}
		return -1;
	},
	goBottom: function() {
		this.move(() => {
			for (var s = 0; s < this.Shu; s++) {
				this.goBottomNext(s);
			}
		});
	},
	goBottomNext: function(s) {
		for (var h = this.Heng - 1; h > 0; h--) {
			var prevHeng = this.getBottomNext(h, s);
			if (prevHeng == -1) {
				break;
			} else {
				if (this.data[h][s] == 0) {
					this.data[h][s] = this.data[prevHeng][s];
					this.data[prevHeng][s] = 0;
					h++;
				} else if (this.data[h][s] ==
					this.data[prevHeng][s]) {
					this.data[h][s] *= 2;
					this.score += this.data[h][s];
					this.data[prevHeng][s] = 0;
				}
			}
		}
	},
	getBottomNext: function(h, s) {
		h--
		for (; h >= 0; h--) {
			if (this.data[h][s] != 0)
				return h;
		}
		return -1;
	},

	Heng: 4, //横
	Shu: 4, //竖
	data: null, //用于存取格子数组
	score: 0, //得分
	state: 1, //状态值 0为游戏结束，1为游戏开始
	switchGame: true //游戏暂停
}
sgypGame.start();
document.getElementById('btn').addEventListener('click', function() {
	sgypGame.Heng=4;
	sgypGame.Shu=4;
	sgypGame.score=0;
	sgypGame.state=1;
	sgypGame.data=null;
	document.getElementById("gameover").style.display = "none";
	document.getElementById("final").style.display='none'
	document.getElementById('container').style.display = "flex";
	sgypGame.start();
});