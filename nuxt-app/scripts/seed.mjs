// scripts/seed.mjs
// Inserta temáticas predeterminadas en el backend de DigitalBoard

const API_BASE = process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8081/api/v1'

const DEFAULT_TOPICS = [
  {
    topicName: 'Anuncios Generales',
    topicDescription: 'Noticias institucionales, fechas importantes y comunicados oficiales para toda la comunidad.',
  },
  {
    topicName: 'Dudas de Clase y Tutorías',
    topicDescription: 'Preguntas académicas, resolución de ejercicios y consultas sobre las materias en curso.',
  },
  {
    topicName: 'Recursos y Material de Estudio',
    topicDescription: 'Enlaces a libros, guías pedagógicas, diapositivas y herramientas útiles compartidas.',
  },
  {
    topicName: 'Proyectos Colaborativos',
    topicDescription: 'Espacio para conformar grupos de trabajo, compartir avances y coordinar entregas.',
  },
  {
    topicName: 'Debates y Charlas Abiertas',
    topicDescription: 'Espacio de discusión constructiva sobre temas de interés general, ciencia y tecnología.',
  },
]

async function seed() {
  console.log(`📡 Conectando a la API en: ${API_BASE}/topics`)

  try {
    // 1. Obtener temáticas existentes para evitar duplicados
    const res = await fetch(`${API_BASE}/topics`)
    if (!res.ok) {
      throw new Error(`La API respondió con status ${res.status}: ${res.statusText}`)
    }
    const existing = await res.json()
    const existingNames = new Set(existing.map((t) => t.topicName.trim().toLowerCase()))

    console.log(`🔍 Temáticas ya existentes en el servidor: ${existing.length}`)

    let createdCount = 0

    for (const topic of DEFAULT_TOPICS) {
      if (existingNames.has(topic.topicName.toLowerCase())) {
        console.log(`⏩ La temática "${topic.topicName}" ya existe. Omitiendo.`)
        continue
      }

      const createRes = await fetch(`${API_BASE}/topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(topic),
      })

      if (createRes.ok || createRes.status === 201) {
        const created = await createRes.json()
        console.log(`✅ Creada temática ID ${created.id}: "${created.topicName}"`)
        createdCount++
      } else {
        const errText = await createRes.text()
        console.error(`❌ Error al crear "${topic.topicName}" (${createRes.status}): ${errText}`)
      }
    }

    console.log(`\n🎉 Proceso finalizado: ${createdCount} temática(s) nueva(s) agregada(s).`)
  } catch (error) {
    console.error(`\n❌ Error de conexión: ${error.message}`)
    console.error(`Verifica que el backend de Spring Boot esté corriendo en ${API_BASE}`)
    process.exit(1)
  }
}

seed()
