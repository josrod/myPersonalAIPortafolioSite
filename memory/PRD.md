# AI-First Consulting Portfolio - PRD
## Fase 6: Next Phase Planning

---

## 1. Estado Actual del Producto (Fases 1-5 Completadas)

### Arquitectura
| Capa | Tecnologia | Puerto |
|------|-----------|--------|
| Frontend | Vite + React + TypeScript + Tailwind CSS v4 | 3000 |
| Backend | FastAPI + Python | 8001 |
| Base de datos | MongoDB | 27017 |
| AI | OpenAI GPT-4o-mini (Emergent LLM Key) | - |
| Email | Resend (LIVE) | - |
| PDF | fpdf2 | - |

### Funcionalidades Implementadas
- **8 proyectos** con hover cinematografico (zoom, play overlay, scan line, tagline reveal, soporte MP4)
- **Homepage**: Hero, features, testimonials (scroll animations), lead magnet, CTA
- **Paginas**: About, Contact, Consultation booking, AI Problem Solver, Admin Dashboard
- **Integraciones**: Resend email (confirmaciones + notificaciones admin), AI Chat, Calendar ICS, PDF Lead Magnet
- **Multi-idioma**: EN, ES, DE, PT-BR
- **Dark mode** con persistencia localStorage
- **Admin** (/admin): Stats, tablas de contactos/citas/leads, sistema de notificaciones

---

## 2. Fase 6 - Alcance

### 2.1 Blog / Centro de Recursos
**Prioridad**: P0
**Objetivo**: Posicionar la marca como experto en AI-first development y generar trafico organico SEO.

#### Requisitos Funcionales
- Pagina `/blog` con grid de articulos (imagen, titulo, extracto, fecha, tags)
- Pagina de detalle `/blog/:slug` con contenido renderizado en Markdown
- Backend: CRUD de articulos almacenados en MongoDB (titulo, slug, contenido markdown, imagen, tags, autor, fecha, publicado/borrador)
- Admin: Seccion en dashboard para crear/editar/eliminar articulos
- Seed data: 3 articulos iniciales sobre AI consulting
- Tags/categorias: AI Strategy, Development, Case Studies, Industry Insights
- Compartir en redes sociales (meta tags OG dinamicos por articulo)
- Traduccion: Soporte multi-idioma para la UI del blog (los articulos se escriben en un idioma)

#### Criterios de Aceptacion
- [ ] Pagina /blog lista articulos con paginacion
- [ ] Pagina /blog/:slug renderiza contenido markdown correctamente
- [ ] Admin puede crear, editar y eliminar articulos
- [ ] SEO: Meta tags OG dinamicos por articulo
- [ ] 3 articulos seed cargados al iniciar
- [ ] Dark mode compatible

---

### 2.2 Email Drip Campaign Automatizado (Lead Nurturing)
**Prioridad**: P0
**Objetivo**: Triplicar conversion de lead magnet a consulta agendada.

#### Flujo de la Campana
```
Dia 0: Lead descarga guia PDF
        -> Email 1: "Tu guia esta lista" + link PDF + bienvenida
        
Dia 3: Automatico
        -> Email 2: Caso de estudio - "Como [empresa] redujo 60% de trabajo manual con AI"
        
Dia 7: Automatico
        -> Email 3: Invitacion a consulta gratuita + link directo a /consultation
```

#### Requisitos Funcionales
- Backend: Coleccion `drip_campaigns` en MongoDB con estado de cada lead en la campana
- Backend: Endpoint cron/scheduled que revisa leads pendientes y envia el email correspondiente segun dias transcurridos
- Backend: Endpoint manual `/api/admin/drip/process` para disparar el procesamiento (para testing y para conectar a un cron externo)
- Admin: Seccion en dashboard mostrando estado de la campana (leads en cada etapa, emails enviados, conversiones)
- Templates HTML profesionales para cada email del drip
- Respetar rate limits de Resend (free tier: 100 emails/dia)

#### Criterios de Aceptacion
- [ ] Lead nuevo entra automaticamente a la campana
- [ ] Email Dia 0 se envia al capturar lead (ya implementado parcialmente)
- [ ] Email Dia 3 se envia al procesar campana
- [ ] Email Dia 7 se envia al procesar campana
- [ ] Admin ve estado de la campana
- [ ] No se envian duplicados

---

### 2.3 Videos Demo Reales en Project Cards
**Prioridad**: P1
**Objetivo**: Incrementar engagement 80%+ en la seccion de proyectos.

#### Requisitos
- Grabar/obtener videos MP4 de 15-30 segundos de cada proyecto (screen recording del app en uso)
- Subir videos a un CDN o almacenamiento (Cloudinary, o servir desde el backend)
- Agregar la propiedad `video` a cada proyecto en Projects.tsx
- El componente ProjectMediaCard ya soporta reproduccion de video en hover

#### Nota
- La infraestructura frontend ya esta lista (propiedad `video` en ProjectData)
- Solo necesita URLs de videos y agregarlas al array de proyectos
- Recomendacion: Usar Cloudinary free tier para hospedar los videos

---

### 2.4 Google Calendar API (OAuth)
**Prioridad**: P2
**Objetivo**: Sincronizar consultas agendadas directamente con Google Calendar del consultor.

#### Requisitos
- Crear proyecto en Google Cloud Console
- Configurar OAuth 2.0 consent screen
- Backend: Flujo OAuth para autenticar la cuenta del consultor
- Backend: Al crear appointment, crear evento automaticamente en Google Calendar
- Almacenar refresh token de Google en .env

#### Nota
- Requiere credenciales OAuth del usuario (Client ID, Client Secret)
- Se dejara como P2 hasta que el usuario proporcione las credenciales de Google Cloud

---

### 2.5 Analytics Interno del Portafolio
**Prioridad**: P2
**Objetivo**: Datos accionables para optimizar conversion.

#### Metricas a Trackear
- Page views por seccion (Home, Projects, Contact, Consultation, Blog)
- Clicks en "View Project" por proyecto
- Apertura del chat widget
- Funnel: Visita -> Lead Magnet -> Contacto -> Consulta agendada
- Tiempo promedio en pagina

#### Requisitos
- Backend: Endpoint `POST /api/analytics/event` para registrar eventos
- Frontend: Hook `useAnalytics()` que dispara eventos en cada pagina/accion
- Admin: Tab "Analytics" en el dashboard con graficos (recharts ya instalado)

---

## 3. Plan de Ejecucion Recomendado

| Orden | Feature | Esfuerzo | Impacto |
|-------|---------|----------|---------|
| 1 | Blog / Centro de Recursos | Alto | Alto (SEO + autoridad) |
| 2 | Email Drip Campaign | Medio | Alto (conversion leads) |
| 3 | Videos Demo Reales | Bajo | Medio (engagement) |
| 4 | Analytics Interno | Medio | Medio (datos decision) |
| 5 | Google Calendar OAuth | Medio | Bajo (conveniencia) |

---

## 4. Credenciales y Configuracion

### Actuales
- **Admin Dashboard**: `/admin` / `admin2026!`
- **Resend API Key**: Configurada en `/app/backend/.env`
- **Emergent LLM Key**: Configurada en `/app/backend/.env`

### Necesarias para Fase 6
- **Google Cloud OAuth** (solo si se implementa 2.4): Client ID + Client Secret
- **Cloudinary** (opcional para videos 2.3): Cloud name + API Key
- **Dominio personalizado** (recomendado para Resend): Para que emails salgan desde tu@tudominio.com en vez de onboarding@resend.dev

---

## 5. Riesgos y Consideraciones

| Riesgo | Mitigacion |
|--------|-----------|
| Rate limit Resend free tier (100 emails/dia) | Implementar cola de emails con reintentos |
| Articulos de blog sin trafico | SEO on-page + compartir en redes |
| Videos pesados ralentizan carga | Lazy loading + CDN + compresion |
| Google OAuth complejidad | Implementar solo cuando haya credenciales |
