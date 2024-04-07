var config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 700,
    playerSpeed: 500,
    enemyCount: 12,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var worldWidth = config.width * 5;
var scoreText;
var cornerText;
var score = 0;
var hp = 5;
var bombs;
var facing;
var noenemies;
var nostars;
var cheat = false;

function preload ()
{
    this.load.image('background','assets/background.png');
    this.load.image('tile','assets/tile.png');
    this.load.image('player','assets/player.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('tileleft', 'assets/tileleft.png');
    this.load.image('tilecenter', 'assets/tilecenter.png');
    this.load.image('tileright', 'assets/tileright.png');
    this.load.image('well','assets/well.png')
    this.load.image('tower','assets/tower.png')
    this.load.image('bomb','assets/bomb.png')
    this.load.image('enemy','assets/enemy.png')
    this.load.image('bullet','assets/bullet.png')
}
function create()
{
    this.add.tileSprite(0,0,worldWidth,config.height+161,"background").setOrigin(0,0).setDepth(0);
    platforms = this.physics.add.staticGroup();
    for (var i = 0; i<worldWidth;i = i +189){
        platforms.create(i, 880, 'tile').refreshBody();
    }
    for (var i = 0; i<worldWidth;i = i + Phaser.Math.FloatBetween(400,600)){
        var rand = Phaser.Math.FloatBetween(400,700);
        platforms.create(i, rand, 'tileleft').refreshBody();
        platforms.create(i+128,rand,'tilecenter').refreshBody();
        platforms.create(i+256,rand,'tileright').refreshBody();
    }
    for (var i = 0; i<worldWidth; i = i + Phaser.Math.FloatBetween(400,600)){
        this.add.image(i,800,'well').setDepth(1);
    }
    for (var i = 0; i<worldWidth; i = i + Phaser.Math.FloatBetween(200,600)){
       this.add.image(i,730,'tower').setDepth(2).setScale(0.5);
    }

    platforms.create(9600,880,'tile')
    player = this.physics.add.sprite(100,100,'player').setDepth(5); 
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, platforms);
    stars = this.physics.add.group({
        key: 'star',
        repeat: 50,
        setXY: { x: 1, y: 0, stepX: Phaser.Math.FloatBetween(70,250) }
    });
    enemies = this.physics.add.group({
        key: 'enemy',
        repeat: 1,
        setXY: {x: Phaser.Math.FloatBetween(worldWidth/20, worldWidth/10), y: config.height - 150}
    }).setDepth(5);
    bullets = this.physics.add.group();

    this.physics.add.collider(bullets, platforms, function (bullet) {
        bullet.destroy();
    }, null, this);

    this.input.on('pointerdown', function (pointer) {
        if (pointer.leftButtonDown()) {
            fireBullet();
        }
    }, this);
    bombs = this.physics.add.group();
    scoreText = this.add.text(this.cameras.main.worldView.x, this.cameras.main.worldView.y, 'Score: 0', { fontSize: '32px', fill: '#000' });
    hpText = this.add.text(this.cameras.main.worldView.x, this.cameras.main.worldView.y, hp, { fontSize: '32px', fill: '#000' });
    cornerText = this.add.text(this.cameras.main.worldView.x, this.cameras.main.worldView.y, null, { fontSize: '32px', fill: '#000' });
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    this.physics.add.collider(enemies, platforms);
    this.physics.add.collider(player, enemies, hitEnemy, null, this);
    this.physics.add.collider(enemies, bullets, destroyEnemy, null, this);
    
    this.cameras.main.setBounds(0,0,worldWidth,919);
    this.physics.world.setBounds(0,0,worldWidth,919);
    this.cameras.main.startFollow(player);
}
function update()
{
    scoreText.setPosition(this.cameras.main.worldView.x+16,this.cameras.main.worldView.y+16);
    hpText.setPosition(this.cameras.main.worldView.x+config.width-100,this.cameras.main.worldView.y+16);
    scoreText.setText('Score: ' + score);
    cornerText.setPosition(this.cameras.main.worldView.x+(config.width/2),this.cameras.main.worldView.y+16)
    if (cursors.left.isDown)
    {
        player.setVelocityX(-config.playerSpeed);
        facing = "left";
        console.log(facing);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(config.playerSpeed);
        facing = "right";
        console.log(facing);
    }
    else
    {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-500);
    }
    if(noenemies == true && nostars == true){
        cornerText.setText("You Win\nNow you can just move around\nTo restart,hit arrow key down\n")
        if(cursors.down.isDown){
            location.reload();
        }
    }
    if(config.physics.arcade.debug == true && cursors.down.isDown){
        cheat = true
        hp = 99999999
        cornerText.setText("HP Cheat is on")
    }
}
function collectStar (player, star)
{
    star.disableBody(true, true);
    score += 1;
    scoreText.setText('Score: ' + score);
    var bomb = bombs.create(player.x+Phaser.Math.FloatBetween(50,250), player.y-Phaser.Math.FloatBetween(50,400), 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
    if (stars.countActive(true) === 0){
        nostars = true;
    }
}
function setHP(){
    if (hp <= 0){
        hpText.setText('0');
        scoreText.setText("You Lose\n      " + score);
        setTimeout(() =>location.reload(),1000);
    }
    if(cheat == true){
        hpText.setText("∞")
    }
    else{
        hpText.setText(hp);
    }
    
}   
function hitBomb(){
    hp = hp - 1;
    setHP();
}
function fireBullet() {
    var bullet = bullets.create(player.x, player.y, 'bullet');
    bullet.setDepth(4).setVelocityX(player.flipX ? -500 : 500);
    if(facing == "left"){
        bullet.setVelocityX(-config.playerSpeed);
    }
    else{
        bullet.setVelocityX(config.playerSpeed);
    }
    
    
}
function destroyEnemy(enemy){
    enemy.disableBody(true, true);
    score += 10;
    if (enemies.countActive(true) === 0){
        noenemies = true;
    }
}
function hitEnemy(enemy){
    enemy.disableBody(true, true);
    hp = hp - 1
}

