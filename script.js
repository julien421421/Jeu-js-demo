const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.7




const background = new Sprite ({
    position:{
        x:0,
        y:0
    },
    imageSrc:'background.png'
}

)

const shop = new Sprite({
    position:{
        x:500,
        y:95
    },
    imageSrc:'shop_anim.png' ,
    scale:3 ,
    framesMax:6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc:'Idle.png',
    framesMax:8,
    scale:2.5,
    offset: {
        x:215 ,
        y:162
    },
    sprites:{
        idle:{
            imageSrc:'Idle.png',
            framesMax:8

        },
        run:{
            imageSrc:'Run.png',
            framesMax:8,
            

        },
        jump:{
            imageSrc:'Jump.png',
            framesMax:2
        }, 
        fall:{
            imageSrc:'Fall.png',
            framesMax:2
        }, 
        attack:{
            imageSrc:'Attack1.png',
            framesMax:6
        }, 
        takeHit:{
            imageSrc:'Take Hit - white silhouette.png',
            framesMax:4
        },
        death:{
            imageSrc:'Death.png',
            framesMax:6
        }

    },
    attackBox: {
        offset:{
            x:100,
            y:50
        },
        width:130,
        height:50
    }
})





const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: -50,
        y: 0
    },

    imageSrc:'Idle1.png',
    framesMax:4,
    scale:2.5,
    offset: {
        x:215 ,
        y:175
    },
    sprites:{
        idle:{
            imageSrc:'Idle1.png',
            framesMax:4

        },
        run:{
            imageSrc:'Run1.png',
            framesMax:8,
            

        },
        jump:{
            imageSrc:'Jump1.png',
            framesMax:2
        }, 
        fall:{
            imageSrc:'Fall1.png',
            framesMax:2
        }, 
        attack:{
            imageSrc:'Attack3.png',
            framesMax:4
        },
        takeHit:{
            imageSrc:'Take hit.png',
            framesMax:3
        },
        death:{
            imageSrc:'Death1.png',
            framesMax:7
        }

    },
    attackBox: {
        offset:{
            x:-150,
            y:50
        },
        width:130,
        height:50
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },

    z: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }


}


let lastKey



decreaseTime();


function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    enemy.update();
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    if (keys.a.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
      player.swicthSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'q') {
        player.velocity.x = -5
        player.swicthSprite('run')
    } else {
        player.swicthSprite('idle')
    }
    if(player.velocity.y<0){
        player.swicthSprite('jump')
       
    } else if (player.velocity.y>0){
        player.swicthSprite('fall')
    }

    if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        
       enemy.velocity.x = 5
       enemy.swicthSprite('run')
        
    } else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
      
        enemy.velocity.x = -5
        enemy.swicthSprite('run')
    }
else {
   enemy.swicthSprite('idle')
}
if(enemy.velocity.y<0){
    enemy.swicthSprite('jump')
   
} else if (enemy.velocity.y>0){
    enemy.swicthSprite('fall')
}
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) &&
        player.isAttacking && player.framesCurrent === 4) {
        enemy.takeHit()
        player.isAttacking = false;
       
  
        gsap.to('#enemyHealth',{
            width:enemy.health + '%'
        })
    }

if ( player.isAttacking && player.framesCurrent ===4)
{
    player.isAttacking = false;
}

    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
        enemy.isAttacking && enemy.framesCurrent===2) {
            player.takeHit()
            enemy.isAttacking = false;
       
            gsap.to('#playerHealth',{
                width:player.health + '%'
            })

    }
    if ( enemy.isAttacking && enemy.framesCurrent ===2)
{
    enemy.isAttacking = false;
}

    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });

    }


}

animate();

window.addEventListener('keydown', (event) => {
    if(!player.dead ){

   
    switch (event.key) {
        case 'd':
            keys.a.pressed = true
            player.lastKey = 'd'
            break;
        case 'q':
            keys.d.pressed = true
            player.lastKey = 'q'
            break;
        case 'z':
            player.velocity.y = -20
            

            break;
        case ' ':
            player.attack()
            break;
    }

    if(!enemy.dead)
    switch (event.key) {

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break;
        case 'ArrowUp':
            enemy.velocity.y = -20

            break;
        case 'ArrowDown':
            enemy.attack()
            break;

    }
}
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.a.pressed = false
            break;
        case 'q':
            keys.d.pressed = false
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false

            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false

            break;


    }
})