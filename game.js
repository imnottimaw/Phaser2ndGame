var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 919,
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
var worldWidth = config.width*5;

function preload ()
{
    this.load.image('background','assets/background.png');
    this.load.image('tile','assets/tile.png');
    this.load.image('player','assets/player.png');
    this.load.image('star', 'assets/star.png');
}
function create()
{
    this.add.image(960, 500, 'background');
    platforms = this.physics.add.staticGroup();
    for (var i = 0; i<worldWidth;i = i +189){
        platforms.create(i, 880, 'tile').refreshBody();
    }
    for (var e = 0; e<600;e= e+189){
        platforms.create(e,500,'tile').refreshBody();
    }
    for (var e = 1200; e<2000;e= e+189){
        platforms.create(e,600,'tile').refreshBody();
    }
    player = this.physics.add.sprite(100,100,'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, platforms);
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 200 }
    });
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    
}
function update()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
    }
    else
    {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-450);
    }
}
function collectStar (player, star)
{
    star.disableBody(true, true);
}