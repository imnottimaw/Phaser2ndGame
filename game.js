var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 919,
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
var score = 0;
var hp = 5;
var bombs;

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
}
function create()
{
    this.add.tileSprite(0,0,worldWidth,1080,"background").setOrigin(0,0).setDepth(0);
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
        repeat: 100,
        setXY: { x: 1, y: 0, stepX: Phaser.Math.FloatBetween(30,100) }
    });
    //enemy = this.physics.add.group({
    //    key: 'enemy',
    //    repeat: config.enemyCount,
    //    setXY: {x: 100, y: config.height - 150 }
    //});
    bombs = this.physics.add.group();
    scoreText = this.add.text(this.cameras.main.worldView.x, this.cameras.main.worldView.y, 'Score: 0', { fontSize: '32px', fill: '#000' });
    hpText = this.add.text(this.cameras.main.worldView.x, this.cameras.main.worldView.y, hp, { fontSize: '32px', fill: '#000' });
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    
    
    this.cameras.main.setBounds(0,0,worldWidth,919);
    this.physics.world.setBounds(0,0,worldWidth,919);
    this.cameras.main.startFollow(player);
}
function update()
{
    scoreText.setPosition(this.cameras.main.worldView.x+16,this.cameras.main.worldView.y+16);
    hpText.setPosition(this.cameras.main.worldView.x+1850,this.cameras.main.worldView.y+16);
    if (cursors.left.isDown)
    {
        player.setVelocityX(-config.playerSpeed);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(config.playerSpeed);
    }
    else
    {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-500);
    }
}
function collectStar (player, star)
{
    star.disableBody(true, true);
    score += 1;
    scoreText.setText('Score: ' + score);
    var bomb = bombs.create(player.x-Phaser.Math.FloatBetween(50,200), player.y-Phaser.Math.FloatBetween(50,200), 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
}
function setHP(){
    if (hp <= 0){
        hpText.setText('0');
        scoreText.setText("You Lose\n      " + score);
        setTimeout(() => location.reload(), 10000)
    }
    hpText.setText(hp);
}   
function hitBomb(){
    hp = hp - 1;
    setHP();
}
