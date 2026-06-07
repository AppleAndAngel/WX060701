import { ref, onMounted, onUnmounted } from 'vue'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
  maxLife: number
  color: string
}

interface Ripple {
  x: number
  y: number
  radius: number
  maxRadius: number
  opacity: number
}

export const useParticleSystem = (canvasRef: { value: HTMLCanvasElement | null }) => {
  const particles = ref<Particle[]>([])
  const ripples = ref<Ripple[]>([])
  const mousePos = ref({ x: 0, y: 0 })
  let animationId: number | null = null
  let ctx: CanvasRenderingContext2D | null = null
  let width = 0
  let height = 0
  const particleCount = 150

  const colors = ['#d4af37', '#c0c0c0', '#9370db', '#ffffff', '#e6e6fa']

  const initCanvas = () => {
    if (!canvasRef.value) return
    ctx = canvasRef.value.getContext('2d')
    resize()
    createInitialParticles()
    animate()
  }

  const resize = () => {
    if (!canvasRef.value) return
    width = canvasRef.value.width = window.innerWidth
    height = canvasRef.value.height = window.innerHeight
  }

  const createInitialParticles = () => {
    particles.value = []
    for (let i = 0; i < particleCount; i++) {
      particles.value.push(createParticle())
    }
  }

  const createParticle = (x?: number, y?: number): Particle => {
    return {
      x: x ?? Math.random() * width,
      y: y ?? Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      life: 1,
      maxLife: 1,
      color: colors[Math.floor(Math.random() * colors.length)]
    }
  }

  const createRipple = (x: number, y: number, maxRadius: number = 100) => {
    ripples.value.push({
      x,
      y,
      radius: 0,
      maxRadius,
      opacity: 0.6
    })
  }

  const animate = () => {
    if (!ctx) return
    const canvasCtx = ctx
    
    canvasCtx.fillStyle = 'rgba(5, 5, 16, 0.15)'
    canvasCtx.fillRect(0, 0, width, height)

    particles.value.forEach((particle, index) => {
      const dx = mousePos.value.x - particle.x
      const dy = mousePos.value.y - particle.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < 150) {
        const force = (150 - dist) / 150
        particle.vx += (dx / dist) * force * 0.02
        particle.vy += (dy / dist) * force * 0.02
      }

      particle.x += particle.vx
      particle.y += particle.vy
      
      particle.vx *= 0.99
      particle.vy *= 0.99

      if (particle.x < 0) particle.x = width
      if (particle.x > width) particle.x = 0
      if (particle.y < 0) particle.y = height
      if (particle.y > height) particle.y = 0

      canvasCtx.beginPath()
      canvasCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      canvasCtx.fillStyle = particle.color
      canvasCtx.globalAlpha = particle.opacity
      canvasCtx.fill()
      canvasCtx.globalAlpha = 1

      if (particle.size > 1.5) {
        canvasCtx.beginPath()
        canvasCtx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
        const gradient = canvasCtx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        )
        gradient.addColorStop(0, particle.color + '40')
        gradient.addColorStop(1, 'transparent')
        canvasCtx.fillStyle = gradient
        canvasCtx.fill()
      }
    })

    for (let i = 0; i < particles.value.length; i++) {
      for (let j = i + 1; j < particles.value.length; j++) {
        const p1 = particles.value[i]
        const p2 = particles.value[j]
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < 80) {
          canvasCtx.beginPath()
          canvasCtx.moveTo(p1.x, p1.y)
          canvasCtx.lineTo(p2.x, p2.y)
          canvasCtx.strokeStyle = `rgba(212, 175, 55, ${(1 - dist / 80) * 0.2})`
          canvasCtx.lineWidth = 0.5
          canvasCtx.stroke()
        }
      }
    }

    ripples.value = ripples.value.filter(ripple => {
      ripple.radius += 2
      ripple.opacity -= 0.01
      
      if (ripple.opacity <= 0 || ripple.radius >= ripple.maxRadius) {
        return false
      }

      canvasCtx.beginPath()
      canvasCtx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
      canvasCtx.strokeStyle = `rgba(212, 175, 55, ${ripple.opacity})`
      canvasCtx.lineWidth = 1.5
      canvasCtx.stroke()
      
      return true
    })

    animationId = requestAnimationFrame(animate)
  }

  const handleMouseMove = (e: MouseEvent) => {
    mousePos.value = { x: e.clientX, y: e.clientY }
  }

  const handleClick = (e: MouseEvent) => {
    createRipple(e.clientX, e.clientY, 120)
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2
      const dist = 20
      const p = createParticle(
        e.clientX + Math.cos(angle) * dist,
        e.clientY + Math.sin(angle) * dist
      )
      p.vx = Math.cos(angle) * 1
      p.vy = Math.sin(angle) * 1
      p.size = 2
      particles.value.push(p)
    }
    if (particles.value.length > 300) {
      particles.value.splice(0, 5)
    }
  }

  const stopAnimation = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }

  onMounted(() => {
    initCanvas()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)
  })

  onUnmounted(() => {
    stopAnimation()
    window.removeEventListener('resize', resize)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('click', handleClick)
  })

  return {
    particles,
    ripples,
    mousePos,
    createRipple,
    stopAnimation
  }
}
