var buttonIsPressed = false;

function rand(m, n) {
  return Math.floor(Math.random() * (n - m + 1) + m);
}

class RBTree {
  constructor(arr = []) {
    arr.forEach((node, idx) => {
      node.ty = node.y = 40;
      node.tx = node.x = (idx + 1) * 40;
    });

    this.arr = arr;
    this.red = true;
    this.black = false;
    /*arr.forEach((e) => {
      this.add(e)
    })*/
  };
  add(e) {
    const me = this;

    function add(node, e) {
      if (!node) {
        return e;
      }

      if (e.e < node.e) {
        node.l = add(node.l, e);
      } else if (e.e > node.e) {
        node.r = add(node.r, e);
      }

      if (me.isRed(node.r) && !me.isRed(node.l)) {
        node = me.leftRotate(node);
      }

      if (me.isRed(node.l) && me.isRed(node.l.l)) {
        node = me.rightRotate(node);
      }

      if (me.isRed(node.l) && me.isRed(node.r)) {
        me.flipColors(node);
      }

      return node;
    }

    this.root = add(this.root, e);
    this.root.color = this.black;
    this.setPos();
  };
  isRed(node) {
    return node ? node.color : this.black;
  };
  leftRotate(node) {
    const x = node.r;

    node.r = x.l;
    x.l = node;

    x.color = node.color;
    node.color = this.red;

    return x;
  };
  rightRotate(node) {
    const x = node.l;
    node.l = x.r;
    x.r = node;

    x.color = node.color;
    node.color = this.red;

    return x;
  };
  flipColors(node) {
    node.l.color = node.r.color = this.black;
    node.color = this.red;
  };
  setPos() {
    let iLeft = 20;
    let level = 0;

    function setPos(node) {
      if (!node) {
        return;
      }

      level++;
      setPos(node.l);
      iLeft += 20;
      node.tx = iLeft;
      node.ty = level * 50 + 100;
      setPos(node.r);
      node.l && node.r && (node.tx = (node.l.tx + node.r.tx) / 2);
      level--;
    };

    setPos(this.root);
  };
  nextFrame() {
    function updatePos(node) {
      let vx = (node.tx - node.x) / 20;
      let vy = (node.ty - node.y) / 20;

      vx = vx > 0 ? Math.ceil(vx) : Math.floor(vx);
      vy = vy > 0 ? Math.ceil(vy) : Math.floor(vy);

      node.x += vx;
      node.y += vy;
    };

    function loop(node) {
      if (!node) {
        return;
      }

      updatePos(node);
      loop(node.l);
      loop(node.r);
    };

    this.arr.forEach(updatePos);
    loop(this.root);
  };
  render() {
    gd.clearRect(0, 0, c.width, c.height);

    function drawArr(arr) {
      arr.forEach((node, idx, arr) => {
        gd.beginPath();
        gd.arc(node.x, node.y, 20, 0, 2 * Math.PI);
        gd.fillStyle = node.color ? '#C20000' : '#000000';
        gd.fill();

        gd.textAlign = 'center';
        gd.textBaseline = 'middle';
        gd.fillStyle = '#fff';
        gd.font = '14px Arial';
        gd.fillText(node.e, node.x, node.y);
      });
    };
    function drawLine(node) {
      if (!node) {
        return;
      }

      gd.beginPath();
      node.l && gd.lineTo(node.l.x, node.l.y);
      gd.lineTo(node.x, node.y);
      node.r && gd.lineTo(node.r.x, node.r.y);
      gd.strokeStyle = '#FFFFFF';
      gd.stroke();

      drawLine(node.l);
      drawLine(node.r);
    };

    function drawCircle(node) {
      if (!node) {
        return;
      }

      gd.beginPath();
      gd.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      gd.fillStyle = node.color ? '#C20000' : '#000000';
      gd.fill();

      gd.textAlign = 'center';
      gd.textBaseline = 'middle';
      gd.fillStyle = '#fff';
      gd.font = '14px Arial';
      gd.fillText(node.e, node.x, node.y);

      drawCircle(node.l);
      drawCircle(node.r);
    };

    drawArr(this.arr);
    drawLine(this.root);
    drawCircle(this.root);
  };
};

const c = document.getElementById('c');
const gd = c.getContext('2d');
let len = 0;
let arr = new Array(len).fill().map((_, idx) => {
  return rand(0, 1000);
});

// arr = [1,2,3,4]

arr = arr.map((e) => {
  return {
    e,
    l: null,
    r: null,
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    color: true,
  }
});
let rbTree = new RBTree(arr);

window.onresize = (e) => {
  c.width = c.offsetWidth;
  c.height = c.offsetHeight;

  rbTree.render();
}

window.onresize();
//??????200ms???????????????
function loopAdd() {
  setTimeout(() => {
	if (rbTree.arr.length != 0 && buttonIsPressed) {
		console.log(buttonIsPressed);
		const node = rbTree.arr.shift();
		rbTree.arr.forEach((node, idx, arr) => {
		  node.ty = 40;
		  node.tx = (idx + 1) * 40;
		})
		rbTree.add(node);
	}
	buttonIsPressed = false;
    loopAdd();
  }, 200);
};

function loopRender() {
  requestAnimationFrame(() => {
    rbTree.nextFrame();
    rbTree.render();
    loopRender();
  });
};

function SetContinueButton() {
	buttonIsPressed = true;
}

function submit(){
	var v = document.getElementById("text").value;
	if (!Number(v)) {
		alert('Invalid input "' + v + '", please input a number.');
		return;
	}
	v = Number(v);
	if(v > 99999) {
		alert(v + "is too large, there will be poor display, choose a small.");
		return;
	}
	rbTree.arr.push({
		e: v,
		l: null,
		r: null,
		x: (rbTree.arr.length + 1) * 40,
		y: 40,
		tx: (rbTree.arr.length + 1) * 40,
		ty: 40,
		color: true,
	});
}
function randAdd() {
	var v = rand(0, 1000);
	rbTree.arr.push({
		e: v,
		l: null,
		r: null,
		x: (rbTree.arr.length + 1) * 40,
		y: 40,
		tx: (rbTree.arr.length + 1) * 40,
		ty: 40,
		color: true,
	});
}
loopAdd();
loopRender();