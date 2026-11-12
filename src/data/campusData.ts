/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GpsCoord {
  lat: number;
  lng: number;
}

export interface RoomInfo {
  code: string;
  title: string;
  floor: string;
  floorLevel: number;
  type: 'aula' | 'laboratorio' | 'oficina' | 'auditorio' | 'taller' | 'servicio' | 'cultural';
  capacity?: number;
  features?: string[];
}

export interface BuildingLocation {
  id: string;
  code: string; // Letter code on the official map: A, B, C, D, F, G1, G2, H, I, J, K, L, T, P, N, S, O, etc.
  name: string;
  shortName: string;
  category: 'academico' | 'admin' | 'cultural';
  x: number;
  y: number;
  width?: number;
  height?: number;
  node: string;
  floors: string;
  totalFloors: number;
  details: string;
  description: string;
  gps: GpsCoord;
  rooms: RoomInfo[];
  hours?: string;
  accessibility: string;
  image?: string;
  color: string;
  accentColor: string;
  iconName: string;
  polygonPoints?: string; // Optional exact polygon for architectural building footprint
}

export interface GraphNode {
  x: number;
  y: number;
  label: string;
}

// Coordinate system calibrated to the official map (778 x 649)
export const LOCATIONS: Record<string, BuildingLocation> = {
  ingreso: {
    id: 'ingreso',
    code: 'IN',
    name: 'Ingreso Principal (Av. 14 de Septiembre)',
    shortName: 'Ingreso Principal',
    category: 'admin',
    x: 292,
    y: 485,
    width: 50,
    height: 30,
    node: 'n_ingreso',
    floors: 'Planta Baja',
    totalFloors: 1,
    details: 'Control de acceso con credenciales, molinetes biométricos, caseta de seguridad y tótems digitales.',
    description: 'Acceso peatonal principal al Campus Obrajes desde la Av. 14 de Septiembre, con conexión directa a paradas del PumaKatari y minibuses.',
    gps: { lat: -16.52295, lng: -68.11195 },
    accessibility: 'Rampa de acceso universal sin desniveles y torniquetes para personas con movilidad reducida.',
    hours: 'Lunes a Viernes 06:30 - 22:00 | Sábados 07:00 - 18:00',
    color: '#0284c7',
    accentColor: '#38bdf8',
    iconName: 'ShieldCheck',
    rooms: [
      { code: 'SEG-01', title: 'Caseta de Seguridad y Control de Acceso', floor: 'Planta Baja', floorLevel: 0, type: 'servicio', features: ['Atención visitantes', 'Pérdidas y hallazgos', 'Credenciales'] },
      { code: 'TOTEM-01', title: 'Tótem Digital de Bienvenida e Información UCB', floor: 'Planta Baja', floorLevel: 0, type: 'servicio', features: ['Pantalla táctil', 'QR de Mapa', 'Directorio de aulas'] }
    ]
  },
  atrio: {
    id: 'atrio',
    code: 'ATR',
    name: 'El Atrio Central de Ingreso',
    shortName: 'El Atrio',
    category: 'cultural',
    x: 285,
    y: 450,
    width: 60,
    height: 35,
    node: 'n_atrio',
    floors: 'Planta Baja',
    totalFloors: 1,
    details: 'Explanada adoquinada con mesas hexagonales y graderías hacia los bloques centrales.',
    description: 'Espacio de recepción y distribución peatonal entre el Bloque K (Kardex/Rectorado), Bloque J y la subida al Ágora.',
    gps: { lat: -16.52285, lng: -68.11185 },
    accessibility: 'Piso llano y rampas laterales que conectan con los jardines.',
    hours: 'Acceso continuo en horario de campus',
    color: '#0d9488',
    accentColor: '#2dd4bf',
    iconName: 'Sparkles',
    rooms: [
      { code: 'ATR-INFO', title: 'Módulo de Orientación y Guía Estudiantil', floor: 'Planta Baja', floorLevel: 0, type: 'servicio', features: ['Mapas impresos', 'Guías de inscripción'] }
    ]
  },
  bloque_k: {
    id: 'bloque_k',
    code: 'K',
    name: 'Bloque K · Edificio Administrativo Central, Kardex y Cajas',
    shortName: 'Bloque K (Kardex y Cajas)',
    category: 'admin',
    x: 298,
    y: 395,
    width: 85,
    height: 52,
    node: 'n_k',
    floors: '3 Niveles (PB a Piso 2)',
    totalFloors: 3,
    details: 'Rectorado Regional La Paz, Admisiones, Kardex Estudiantil, Cajas y Tesorería, DUBE.',
    description: 'El corazón administrativo del campus. Frente al atrio con su emblemática escalinata semicircular. Aquí se tramitan inscripciones, certificaciones, pagos de colegiaturas y becas.',
    gps: { lat: -16.52270, lng: -68.11175 },
    accessibility: 'Ascensor central y rampas de acceso directo en planta baja.',
    hours: 'Lunes a Viernes 08:00 - 18:30 (Cajas hasta 17:30)',
    image: '/src/assets/images/ucb_patio_central_1794504409155.jpg',
    color: '#0284c7',
    accentColor: '#38bdf8',
    iconName: 'Coffee',
    rooms: [
      { code: 'KARDEX-01', title: 'Kardex Central y Registros Académicos', floor: 'Planta Baja', floorLevel: 0, type: 'oficina', features: ['Ventanilla 1 a 6', 'Historial académico', 'Convalidaciones'] },
      { code: 'CAJAS-01', title: 'Cajas y Tesorería UCB', floor: 'Planta Baja', floorLevel: 0, type: 'oficina', features: ['Cobro de colegiaturas', 'Facturación electrónica', 'Títulos'] },
      { code: 'ADMISIONES', title: 'Dirección de Admisiones y Marketing', floor: 'Piso 1', floorLevel: 1, type: 'oficina', features: ['Inscripciones nuevos alumnos', 'Orientación vocacional'] },
      { code: 'RECTORADO', title: 'Rectorado Regional La Paz y Secretaría General', floor: 'Piso 2', floorLevel: 2, type: 'oficina', features: ['Despacho de Rectorado', 'Sala de Consejo'] }
    ]
  },
  bloque_j: {
    id: 'bloque_j',
    code: 'J',
    name: 'Bloque J · Seguridad, Servicios Generales y Soporte Técnico',
    shortName: 'Bloque J (Servicios)',
    category: 'admin',
    x: 236,
    y: 385,
    width: 44,
    height: 38,
    node: 'n_j',
    floors: '2 Niveles',
    totalFloors: 2,
    details: 'Centro de monitoreo de seguridad, soporte informático a usuarios y almacén central.',
    description: 'Ubicado al oeste del atrio principal, brinda soporte de conectividad, correo institucional y mantenimiento técnico del campus.',
    gps: { lat: -16.52275, lng: -68.11210 },
    accessibility: 'Acceso directo a nivel de piso.',
    hours: 'Lunes a Viernes 07:30 - 20:00',
    color: '#64748b',
    accentColor: '#94a3b8',
    iconName: 'ShieldCheck',
    rooms: [
      { code: 'J-101', title: 'Centro de Cómputo y Soporte TI Estudiantil', floor: 'Planta Baja', floorLevel: 0, type: 'servicio', features: ['Recuperación de cuentas', 'Wi-Fi Eduroam'] },
      { code: 'J-102', title: 'Intendencia y Servicios Generales', floor: 'Planta Baja', floorLevel: 0, type: 'oficina' }
    ]
  },
  bloque_d: {
    id: 'bloque_d',
    code: 'D',
    name: 'Bloque D · Ciencias Económicas, Administrativas y Derecho',
    shortName: 'Bloque D (Económicas y Derecho)',
    category: 'academico',
    x: 198,
    y: 285,
    width: 95,
    height: 120,
    node: 'n_d',
    floors: '4 Niveles (PB a Piso 3)',
    totalFloors: 4,
    details: 'Administración, Economía, Ingeniería Comercial, Derecho, Sala de Juicios Orales y Comunicación.',
    description: 'Edificio de gran extensión en el ala occidental del campus. Cuenta con el tribunal de juicios orales simulados, salas de debate y aulas multimedia.',
    gps: { lat: -16.52230, lng: -68.11220 },
    accessibility: 'Ascensor accesible y rampas norte y sur.',
    hours: 'Lunes a Viernes 07:00 - 21:30 | Sábados 08:00 - 14:00',
    color: '#0284c7',
    accentColor: '#38bdf8',
    iconName: 'Scale',
    rooms: [
      { code: 'D-101', title: 'Aula Magna D-101 · Derecho Constitucional', floor: 'Planta Baja', floorLevel: 0, type: 'aula', capacity: 70, features: ['Pantalla dual', 'Micrófonos'] },
      { code: 'D-201', title: 'Sala de Juicios Orales D-201', floor: 'Piso 1', floorLevel: 1, type: 'auditorio', capacity: 60, features: ['Estrado judicial', 'Sistema de grabación HD'] },
      { code: 'D-304', title: 'Laboratorio Financiero y Bursátil Bloomberg', floor: 'Piso 2', floorLevel: 2, type: 'laboratorio', capacity: 35, features: ['Terminales Bloomberg', 'Pantalla bursátil'] },
      { code: 'D-402', title: 'Aula D-402 · Marketing Estratégico y Negocios', floor: 'Piso 3', floorLevel: 3, type: 'aula', capacity: 50 }
    ]
  },
  bloque_g1: {
    id: 'bloque_g1',
    code: 'G1',
    name: 'Bloque G1 · Aulas Teóricas y Gabinetes Centrales',
    shortName: 'Bloque G1 (Aulas)',
    category: 'academico',
    x: 268,
    y: 335,
    width: 72,
    height: 44,
    node: 'n_g1',
    floors: '3 Niveles',
    totalFloors: 3,
    details: 'Aulas teóricas de formación general, sociología, ética y filosofía.',
    description: 'Ala suroeste del gran complejo G, conecta el paso del atrio con el Ágora y dispone de aulas teóricas de alta rotación.',
    gps: { lat: -16.52250, lng: -68.11180 },
    accessibility: 'Acceso por rampas y pasillos anchos.',
    hours: 'Lunes a Viernes 07:00 - 21:30',
    color: '#0284c7',
    accentColor: '#38bdf8',
    iconName: 'GraduationCap',
    rooms: [
      { code: 'G1-101', title: 'Aula G1-101 · Antropología Cristiana y Ética', floor: 'Planta Baja', floorLevel: 0, type: 'aula', capacity: 48 },
      { code: 'G1-203', title: 'Aula G1-203 · Metodología de la Investigación', floor: 'Piso 1', floorLevel: 1, type: 'aula', capacity: 52 }
    ]
  },
  bloque_g2: {
    id: 'bloque_g2',
    code: 'G2',
    name: 'Bloque G2 · Edificio Central de Aulas y Comedor Universitario',
    shortName: 'Bloque G2 (Edificio Central)',
    category: 'academico',
    x: 375,
    y: 265,
    width: 145,
    height: 60,
    node: 'n_g2',
    floors: '4 Niveles (PB a Piso 3)',
    totalFloors: 4,
    details: 'Gran bloque transversal que bordea el Ágora. En Planta Baja se encuentra el comedor y cafetería central.',
    description: 'Uno de los edificios con mayor tránsito del campus. Alberga decenas de aulas de múltiples carreras, salas de profesores y la cafetería central en su nivel inferior.',
    gps: { lat: -16.52235, lng: -68.11145 },
    accessibility: 'Ascensor central, rampas conectadas con el Ágora y los jardines.',
    hours: 'Lunes a Viernes 07:00 - 21:30 | Sábados 07:30 - 15:00',
    color: '#0284c7',
    accentColor: '#38bdf8',
    iconName: 'GraduationCap',
    rooms: [
      { code: 'CAF-G2', title: 'Cafetería y Comedor Central Estudiantil', floor: 'Planta Baja', floorLevel: 0, type: 'servicio', capacity: 180, features: ['Menú universitario', 'Snacks', 'Microondas'] },
      { code: 'G2-105', title: 'Aula G2-105 · Álgebra Lineal y Probabilidad', floor: 'Piso 1', floorLevel: 1, type: 'aula', capacity: 55, features: ['Proyección láser', 'Pizarras triples'] },
      { code: 'G2-208', title: 'Aula G2-208 · Microeconomía y Mercados', floor: 'Piso 2', floorLevel: 2, type: 'aula', capacity: 50 },
      { code: 'G2-302', title: 'Sala de Estudio Silencioso G2-302', floor: 'Piso 3', floorLevel: 3, type: 'aula', capacity: 40, features: ['Conexiones de energía', 'Wi-Fi 6'] }
    ]
  },
  agora: {
    id: 'agora',
    code: 'ÁGORA',
    name: 'El Ágora UCB (Plaza Mayor del Campus)',
    shortName: 'El Ágora',
    category: 'cultural',
    x: 340,
    y: 195,
    width: 90,
    height: 55,
    node: 'n_agora_center',
    floors: 'Plaza Abierta',
    totalFloors: 1,
    details: 'Gran explanada central con mesas hexagonales, ferias científicas, conciertos y vida universitaria.',
    description: 'El punto neurálgico de encuentro social, debates estudiantiles y ferias académicas de la UCB. Conecta directamente los bloques A, D y G.',
    gps: { lat: -16.52210, lng: -68.11160 },
    accessibility: 'Completamente abierta y nivelada con rampas hacia los bloques.',
    hours: 'Abierta permanentemente durante el horario del campus',
    color: '#f59e0b',
    accentColor: '#fcd34d',
    iconName: 'Sparkles',
    rooms: [
      { code: 'AGORA-PLAZA', title: 'Mesas Hexagonales de Trabajo al Aire Libre', floor: 'Planta Baja', floorLevel: 0, type: 'cultural', features: ['Sombra natural', 'Puntos Wi-Fi'] }
    ]
  },
  bloque_a: {
    id: 'bloque_a',
    code: 'A',
    name: 'Bloque A · Facultad de Ingeniería y Ciencias Exactas',
    shortName: 'Bloque A (Ingenierías)',
    category: 'academico',
    x: 295,
    y: 115,
    width: 145,
    height: 105,
    node: 'n_a',
    floors: '4 Niveles (PB a Piso 3)',
    totalFloors: 4,
    details: 'Decanato de Ingeniería, Ingeniería Civil, Industrial, Ambiental, Mecatrónica, Química y Sistemas.',
    description: 'El edificio principal de la Facultad de Ingeniería. Posee modernos laboratorios de física, química experimental, resistencia de materiales y estaciones CAD.',
    gps: { lat: -16.52175, lng: -68.11170 },
    accessibility: 'Ascensor habilitado para todos los pisos y rampas de acceso frontal desde el Ágora.',
    hours: 'Lunes a Viernes 07:00 - 21:30 | Sábados 07:30 - 15:00',
    image: '/src/assets/images/ucb_bloque_a_ing_1794504408331.jpg',
    color: '#0284c7',
    accentColor: '#38bdf8',
    iconName: 'Cpu',
    rooms: [
      { code: 'A-101', title: 'Aula A-101 · Geometría Descriptiva y Dibujo Técnico', floor: 'Planta Baja', floorLevel: 0, type: 'aula', capacity: 45, features: ['Mesas de dibujo', 'Proyector 4K'] },
      { code: 'LAB-CIV', title: 'Laboratorio de Resistencia de Materiales y Suelos', floor: 'Piso 1', floorLevel: 1, type: 'laboratorio', capacity: 30, features: ['Prensa hidráulica', 'Tamizadoras'] },
      { code: 'A-204', title: 'Aula A-204 · Cálculo Diferencial e Integral', floor: 'Piso 1', floorLevel: 1, type: 'aula', capacity: 55 },
      { code: 'LAB-ROB', title: 'Laboratorio de Robótica y Automatización A-301', floor: 'Piso 2', floorLevel: 2, type: 'laboratorio', capacity: 32, features: ['Brazos robóticos', 'Estaciones de soldadura'] },
      { code: 'A-405', title: 'Aula A-405 · Termodinámica y Procesos Industriales', floor: 'Piso 3', floorLevel: 3, type: 'aula', capacity: 42 }
    ]
  },
  bloque_b: {
    id: 'bloque_b',
    code: 'B',
    name: 'Bloque B · Laboratorios Especializados y Posgrado',
    shortName: 'Bloque B (Laboratorios)',
    category: 'academico',
    x: 402,
    y: 72,
    width: 50,
    height: 42,
    node: 'n_b',
    floors: '3 Niveles',
    totalFloors: 3,
    details: 'Laboratorios de bioingeniería, química orgánica e institutos de investigación.',
    description: 'Ubicado en el extremo norte entre los bloques A y C. Dedicado a investigación aplicada, biotecnología y ensayos científicos avanzados.',
    gps: { lat: -16.52150, lng: -68.11120 },
    accessibility: 'Acceso por caminería norte.',
    hours: 'Lunes a Viernes 07:30 - 20:00',
    color: '#0284c7',
    accentColor: '#38bdf8',
    iconName: 'Cpu',
    rooms: [
      { code: 'B-101', title: 'Laboratorio de Química Orgánica y Bioquímica', floor: 'Planta Baja', floorLevel: 0, type: 'laboratorio', capacity: 25, features: ['Campanas de extracción', 'Centrífugas'] },
      { code: 'B-201', title: 'Instituto de Investigaciones Socio-Ecológicas', floor: 'Piso 1', floorLevel: 1, type: 'oficina' }
    ]
  },
  bloque_c: {
    id: 'bloque_c',
    code: 'C',
    name: 'Bloque C · Ciencias de la Salud, Bioquímica y Aulas Norte',
    shortName: 'Bloque C (Salud y Aulas)',
    category: 'academico',
    x: 520,
    y: 75,
    width: 145,
    height: 58,
    node: 'n_c',
    floors: '3 Niveles',
    totalFloors: 3,
    details: 'Medicina, Enfermería, Odontología, Bioquímica, Farmacia y Laboratorios Clínicos.',
    description: 'Extenso edificio a lo largo del límite norte del campus. Alberga simuladores médicos, microscopía y aulas teóricas del área médica y biológica.',
    gps: { lat: -16.52155, lng: -68.11060 },
    accessibility: 'Rampas de acceso este y oeste.',
    hours: 'Lunes a Viernes 07:00 - 21:00 | Sábados 07:30 - 14:00',
    color: '#0284c7',
    accentColor: '#38bdf8',
    iconName: 'GraduationCap',
    rooms: [
      { code: 'C-102', title: 'Laboratorio de Anatomía y Modelos Anatómicos', floor: 'Planta Baja', floorLevel: 0, type: 'laboratorio', capacity: 35, features: ['Simuladores clínicos', 'Modelos 3D'] },
      { code: 'C-204', title: 'Laboratorio de Fisiología y Farmacología', floor: 'Piso 1', floorLevel: 1, type: 'laboratorio', capacity: 30 },
      { code: 'C-301', title: 'Aula C-301 · Salud Pública y Epidemiología', floor: 'Piso 2', floorLevel: 2, type: 'aula', capacity: 55 }
    ]
  },
  bloque_f: {
    id: 'bloque_f',
    code: 'F',
    name: 'Bloque F · Escuela de Producción y Competitividad (ePC) / Aulas Este',
    shortName: 'Bloque F (ePC y Posgrado)',
    category: 'academico',
    x: 540,
    y: 160,
    width: 115,
    height: 65,
    node: 'n_f',
    floors: '3 Niveles',
    totalFloors: 3,
    details: 'Maestrías, diplomados, Escuela de la Producción y la Competitividad (ePC), salas de trabajo.',
    description: 'Moderno edificio en el sector noreste del campus orientado a posgrados ejecutivos, incubación de empresas e innovación de negocios.',
    gps: { lat: -16.52185, lng: -68.11050 },
    accessibility: 'Ascensor accesible y entrada por jardín este.',
    hours: 'Lunes a Viernes 08:00 - 22:00 | Sábados 08:00 - 16:00',
    color: '#0284c7',
    accentColor: '#38bdf8',
    iconName: 'Award',
    rooms: [
      { code: 'F-101', title: 'Auditorio Ejecutivo ePC · Innovación Empresarial', floor: 'Planta Baja', floorLevel: 0, type: 'auditorio', capacity: 90, features: ['Micrófonos individuales', 'Streaming HD'] },
      { code: 'F-202', title: 'Sala de Estudio para Posgrado y Coworking', floor: 'Piso 1', floorLevel: 1, type: 'aula', capacity: 35 }
    ]
  },
  bloque_h: {
    id: 'bloque_h',
    code: 'H',
    name: 'Bloque H · Bienestar Estudiantil, Kioscos y Cafetería Jardín',
    shortName: 'Bloque H (Bienestar y Café)',
    category: 'admin',
    x: 450,
    y: 260,
    width: 52,
    height: 45,
    node: 'n_h',
    floors: '2 Niveles',
    totalFloors: 2,
    details: 'Cafetería de paso, fotocopiadoras, librería universitaria y oficinas de asociaciones estudiantiles.',
    description: 'Pabellón ubicado junto a los jardines y las fuentes de agua, ideal para recargar energías entre clases con café y snacks.',
    gps: { lat: -16.52225, lng: -68.11100 },
    accessibility: 'Acceso a nivel de piso con mesas en la terraza.',
    hours: 'Lunes a Viernes 07:30 - 19:30',
    color: '#d97706',
    accentColor: '#fbbf24',
    iconName: 'Coffee',
    rooms: [
      { code: 'H-KAFE', title: 'Café de los Jardines UCB', floor: 'Planta Baja', floorLevel: 0, type: 'servicio', features: ['Terraza exterior', 'Pastelería y café'] },
      { code: 'H-FOTO', title: 'Centro de Fotocopiado e Impresiones', floor: 'Planta Baja', floorLevel: 0, type: 'servicio', features: ['Plotters', 'Anillados'] }
    ]
  },
  capilla: {
    id: 'capilla',
    code: 'CAP',
    name: 'Capilla Universitaria "San Pablo" · Pastoral UCB',
    shortName: 'Capilla San Pablo',
    category: 'cultural',
    x: 466,
    y: 365,
    width: 40,
    height: 38,
    node: 'n_capilla',
    floors: 'Planta Única',
    totalFloors: 1,
    details: 'Espacio de oración, misas semanales, reflexión y voluntariado de la Pastoral Universitaria.',
    description: 'Templo católico emblemático en el corazón de los jardines de la UCB. Arquitectura contemporánea con bellos vitrales y entorno de paz.',
    gps: { lat: -16.52260, lng: -68.11090 },
    accessibility: 'Rampa de acceso suave desde la caminería de las fuentes.',
    hours: 'Misas: Miércoles 12:30 | Domingos 11:00 · Abierta de 08:00 a 19:00',
    color: '#7c3aed',
    accentColor: '#a78bfa',
    iconName: 'Church',
    rooms: [
      { code: 'CAP-NAVE', title: 'Nave Central de la Capilla San Pablo', floor: 'Planta Baja', floorLevel: 0, type: 'auditorio', capacity: 160, features: ['Altar mayor', 'Vitrales artísticos'] },
      { code: 'PASTORAL', title: 'Despacho de Pastoral y Acción Social', floor: 'Planta Baja', floorLevel: 0, type: 'oficina', features: ['Voluntariado estudiantil'] }
    ]
  },
  bloque_i: {
    id: 'bloque_i',
    code: 'I',
    name: 'Bloque I · Biblioteca Central UCB "San Pablo" y Hemeroteca',
    shortName: 'Bloque I (Biblioteca Central)',
    category: 'admin',
    x: 585,
    y: 280,
    width: 82,
    height: 85,
    node: 'n_i',
    floors: '3 Niveles',
    totalFloors: 3,
    details: 'Salas de lectura silenciosa, cubículos grupales, hemeroteca, repositorio de tesis y préstamos.',
    description: 'El mayor repositorio bibliográfico de la universidad. Cuenta con más de 120,000 libros impresos, bases de datos digitales mundiales y cubículos de estudio equipados.',
    gps: { lat: -16.52230, lng: -68.11030 },
    accessibility: 'Ascensor interior para todos los pisos y rampas de acceso frontal.',
    hours: 'Lunes a Viernes 07:30 - 21:00 | Sábados 08:30 - 13:00',
    image: '/src/assets/images/ucb_biblioteca_central_1794504409942.jpg',
    color: '#059669',
    accentColor: '#34d399',
    iconName: 'BookOpen',
    rooms: [
      { code: 'BIB-PB', title: 'Mostrador de Préstamos, Devolución y Consulta', floor: 'Planta Baja', floorLevel: 0, type: 'servicio', features: ['Auto-préstamo', 'Casilleros'] },
      { code: 'BIB-101', title: 'Sala General de Lectura y Estudio Silencioso', floor: 'Planta Baja', floorLevel: 0, type: 'aula', capacity: 120 },
      { code: 'BIB-201', title: 'Cubículos de Estudio Grupal (1 al 8)', floor: 'Piso 1', floorLevel: 1, type: 'aula', capacity: 8, features: ['Pantallas HDMI', 'Pizarras acrílicas'] },
      { code: 'BIB-301', title: 'Repositorio de Tesis e Investigación UCB', floor: 'Piso 2', floorLevel: 2, type: 'oficina' }
    ]
  },
  bloque_l: {
    id: 'bloque_l',
    code: 'L',
    name: 'Bloque L · Paraninfo Universitario y Salón de Honor',
    shortName: 'Bloque L (Paraninfo)',
    category: 'cultural',
    x: 595,
    y: 435,
    width: 60,
    height: 56,
    node: 'n_l',
    floors: 'Auditorio Principal',
    totalFloors: 1,
    details: 'Auditorio Magno para actos solemnes de graduación, simposios internacionales y conferencias magistrales.',
    description: 'El recinto ceremonial más importante de la UCB La Paz, situado en el extremo sureste junto a Calle 3 y los jardines.',
    gps: { lat: -16.52280, lng: -68.11020 },
    accessibility: 'Rampa de acceso suave con puerta doble.',
    hours: 'Eventos solemnes programados y conferencias',
    color: '#ea580c',
    accentColor: '#fb923c',
    iconName: 'Award',
    rooms: [
      { code: 'PAR-AUD', title: 'Auditorio Principal Paraninfo UCB', floor: 'Planta Baja', floorLevel: 0, type: 'auditorio', capacity: 420, features: ['Escenario de honor', 'Pantalla cinematográfica', 'Cabina de sonido'] },
      { code: 'PAR-FOYER', title: 'Foyer y Galería de Rectores Eméritos', floor: 'Planta Baja', floorLevel: 0, type: 'cultural', features: ['Exposiciones', 'Recepciones'] }
    ]
  },
  // EXTERNAL BLOCKS (Across Av. 14 de Septiembre)
  bloque_t: {
    id: 'bloque_t',
    code: 'T',
    name: 'Bloque T · Talleres de Arquitectura y Urbanismo',
    shortName: 'Bloque T (Arquitectura)',
    category: 'academico',
    x: 235,
    y: 545,
    width: 48,
    height: 60,
    node: 'n_t',
    floors: '3 Niveles',
    totalFloors: 3,
    details: 'Talleres de diseño arquitectónico, tableros de dibujo, maquetas y proyectos urbanísticos.',
    description: 'Ubicado al frente del campus cruzando la Av. 14 de Septiembre. Sede de la carrera de Arquitectura con amplios ventanales y luz natural.',
    gps: { lat: -16.52330, lng: -68.11210 },
    accessibility: 'Paso peatonal con semáforo sobre Av. 14 de Septiembre y rampa interior.',
    hours: 'Lunes a Viernes 07:30 - 22:00 | Sábados 08:00 - 15:00',
    color: '#0d9488',
    accentColor: '#2dd4bf',
    iconName: 'Palette',
    rooms: [
      { code: 'T-101', title: 'Taller de Diseño Arquitectónico Integral', floor: 'Planta Baja', floorLevel: 0, type: 'taller', capacity: 45, features: ['Tableros basculantes', 'Luz cenital'] },
      { code: 'T-202', title: 'Taller de Urbanismo y Ordenamiento Territorial', floor: 'Piso 1', floorLevel: 1, type: 'taller', capacity: 40 }
    ]
  },
  bloque_p: {
    id: 'bloque_p',
    code: 'P',
    name: 'Bloque P · FabLab, Taller de Maquetas y Corte Láser',
    shortName: 'Bloque P (FabLab Maquetas)',
    category: 'academico',
    x: 235,
    y: 615,
    width: 42,
    height: 42,
    node: 'n_p',
    floors: '2 Niveles',
    totalFloors: 2,
    details: 'Laboratorio de prototipado rápido, cortadoras láser CNC, impresión 3D y carpintería de maquetas.',
    description: 'Laboratorio de fabricación digital para estudiantes de Arquitectura, Diseño Gráfico e Ingenierías.',
    gps: { lat: -16.52360, lng: -68.11200 },
    accessibility: 'Acceso a nivel por la Calle 2.',
    hours: 'Lunes a Viernes 08:00 - 19:00',
    color: '#0d9488',
    accentColor: '#2dd4bf',
    iconName: 'Palette',
    rooms: [
      { code: 'P-FAB', title: 'FabLab UCB · Cortadoras Láser e Impresoras 3D', floor: 'Planta Baja', floorLevel: 0, type: 'taller', capacity: 30, features: ['Láser CO2', 'Plotters A0', 'Fresadora CNC'] },
      { code: 'P-MAQ', title: 'Taller de Carpintería y Ensayos de Maquetas', floor: 'Piso 1', floorLevel: 1, type: 'taller', capacity: 25 }
    ]
  },
  bloque_n: {
    id: 'bloque_n',
    code: 'N',
    name: 'Bloque N · Centro de Idiomas y Relaciones Internacionales',
    shortName: 'Bloque N (Idiomas)',
    category: 'academico',
    x: 408,
    y: 545,
    width: 36,
    height: 46,
    node: 'n_n',
    floors: '2 Niveles',
    totalFloors: 2,
    details: 'Cursos de inglés, francés, alemán, movilidad estudiantil internacional e intercambios.',
    description: 'Centro de formación de lenguas extranjeras y oficina de cooperación académica internacional de la UCB.',
    gps: { lat: -16.52330, lng: -68.11120 },
    accessibility: 'Entrada por Av. 14 de Septiembre esquina Calle 2.',
    hours: 'Lunes a Viernes 07:00 - 20:30',
    color: '#0284c7',
    accentColor: '#38bdf8',
    iconName: 'BookOpen',
    rooms: [
      { code: 'N-101', title: 'Laboratorio de Fonética e Idiomas Multimedia', floor: 'Planta Baja', floorLevel: 0, type: 'aula', capacity: 30, features: ['Auriculares Hi-Fi', 'Software interactivo'] },
      { code: 'N-ORI', title: 'Oficina de Relaciones Internacionales y Becas', floor: 'Piso 1', floorLevel: 1, type: 'oficina', features: ['Intercambios Erasmus/DAAD'] }
    ]
  },
  bloque_s: {
    id: 'bloque_s',
    code: 'S',
    name: 'Bloque S · Clínica Odontológica y Consultorios Universitarios',
    shortName: 'Bloque S (Clínica Médica)',
    category: 'admin',
    x: 445,
    y: 545,
    width: 38,
    height: 64,
    node: 'n_s',
    floors: '3 Niveles',
    totalFloors: 3,
    details: 'Sillones odontológicos para prácticas clínicas, rayos X y consultorio médico estudiantil.',
    description: 'Complejo de atención en salud comunitaria y formación odontológica y médica de la UCB.',
    gps: { lat: -16.52330, lng: -68.11100 },
    accessibility: 'Rampa de acceso universal para pacientes.',
    hours: 'Lunes a Viernes 08:00 - 18:00',
    color: '#059669',
    accentColor: '#34d399',
    iconName: 'ShieldCheck',
    rooms: [
      { code: 'S-CLIN', title: 'Clínica Odontológica Universitaria', floor: 'Planta Baja', floorLevel: 0, type: 'servicio', capacity: 40, features: ['Sillones dentales', 'Esterilización'] },
      { code: 'S-MED', title: 'Gabinete Médico y Primeros Auxilios', floor: 'Piso 1', floorLevel: 1, type: 'servicio', features: ['Atención médica', 'Seguro estudiantil'] }
    ]
  },
  bloque_o: {
    id: 'bloque_o',
    code: 'O',
    name: 'Bloque O · Centro de Investigaciones Sociales y Jurídicas',
    shortName: 'Bloque O (Investigación)',
    category: 'academico',
    x: 485,
    y: 580,
    width: 44,
    height: 105,
    node: 'n_o',
    floors: '3 Niveles',
    totalFloors: 3,
    details: 'Institutos de investigación aplicada, observatorios económicos y revistas científicas indexadas.',
    description: 'Sede de investigación avanzada y producción científica de las ciencias sociales de la UCB.',
    gps: { lat: -16.52350, lng: -68.11080 },
    accessibility: 'Acceso por Calle 2 y Calle 3.',
    hours: 'Lunes a Viernes 08:30 - 18:30',
    color: '#0284c7',
    accentColor: '#38bdf8',
    iconName: 'Scale',
    rooms: [
      { code: 'O-101', title: 'Observatorio Económico y Social de Bolivia', floor: 'Planta Baja', floorLevel: 0, type: 'oficina', features: ['Estadística aplicada'] },
      { code: 'O-202', title: 'Salas de Seminarios para Investigadores', floor: 'Piso 1', floorLevel: 1, type: 'aula', capacity: 35 }
    ]
  }
};

// Pedestrian Pathway Graph Nodes aligned with the real official map (778 x 649)
export const GRAPH_NODES: Record<string, GraphNode> = {
  n_ingreso:        { x: 292, y: 485, label: 'Ingreso Principal Av. 14 de Septiembre' },
  n_atrio:          { x: 292, y: 450, label: 'El Atrio Central' },
  n_k:              { x: 298, y: 410, label: 'Acceso Bloque K (Kardex y Cajas)' },
  n_j:              { x: 242, y: 415, label: 'Acceso Bloque J (Servicios)' },
  n_d_south:        { x: 205, y: 415, label: 'Caminería Suroeste Bloque D' },
  n_d:              { x: 200, y: 310, label: 'Puerta Principal Bloque D' },
  n_g1:             { x: 260, y: 345, label: 'Acceso Bloque G1' },
  n_agora_south:    { x: 285, y: 280, label: 'Escaleras Atrio hacia el Ágora' },
  n_agora_center:   { x: 340, y: 215, label: 'Plaza El Ágora (Mesas Hexagonales)' },
  n_g2:             { x: 375, y: 275, label: 'Puerta Bloque G2 (Edificio Central)' },
  n_a:              { x: 295, y: 165, label: 'Puerta Bloque A (Ingenierías)' },
  n_agora_north:    { x: 395, y: 145, label: 'Caminería Noreste del Ágora' },
  n_b:              { x: 402, y: 95,  label: 'Acceso Bloque B (Laboratorios)' },
  n_c:              { x: 505, y: 95,  label: 'Acceso Bloque C (Ciencias de la Salud)' },
  n_f:              { x: 515, y: 160, label: 'Puerta Bloque F (ePC y Posgrado)' },
  n_h:              { x: 445, y: 245, label: 'Café Bloque H (Terraza Jardín)' },
  n_fountain_mid:   { x: 384, y: 340, label: 'Paseo de las Fuentes y Graderías' },
  n_capilla:        { x: 466, y: 365, label: 'Atrio Capilla San Pablo' },
  n_jardin_east:    { x: 535, y: 330, label: 'Cruce Jardín hacia Biblioteca' },
  n_i:              { x: 555, y: 280, label: 'Puerta Bloque I (Biblioteca Central)' },
  n_l:              { x: 575, y: 425, label: 'Ingreso Bloque L (Paraninfo)' },
  n_atrio_east:     { x: 440, y: 450, label: 'Sendero Este Atrio - Jardines' },
  // External nodes
  n_crosswalk_t:    { x: 235, y: 505, label: 'Paso Peatonal Av. 14 de Septiembre a Bloque T' },
  n_t:              { x: 235, y: 545, label: 'Puerta Bloque T (Arquitectura)' },
  n_p:              { x: 235, y: 615, label: 'Puerta Bloque P (FabLab y Maquetas)' },
  n_crosswalk_nso:  { x: 420, y: 505, label: 'Paso Peatonal a Bloques N, S, O' },
  n_n:              { x: 408, y: 545, label: 'Puerta Bloque N (Idiomas)' },
  n_s:              { x: 445, y: 545, label: 'Puerta Bloque S (Clínica Odontológica)' },
  n_o:              { x: 485, y: 570, label: 'Puerta Bloque O (Investigaciones)' }
};

export const GRAPH_EDGES: [string, string][] = [
  ['n_ingreso', 'n_atrio'],
  ['n_atrio', 'n_k'],
  ['n_atrio', 'n_j'],
  ['n_j', 'n_d_south'],
  ['n_d_south', 'n_d'],
  ['n_atrio', 'n_agora_south'],
  ['n_agora_south', 'n_g1'],
  ['n_g1', 'n_d'],
  ['n_agora_south', 'n_agora_center'],
  ['n_agora_center', 'n_g2'],
  ['n_agora_center', 'n_a'],
  ['n_a', 'n_agora_north'],
  ['n_agora_center', 'n_agora_north'],
  ['n_agora_north', 'n_b'],
  ['n_b', 'n_c'],
  ['n_agora_north', 'n_f'],
  ['n_c', 'n_f'],
  ['n_f', 'n_h'],
  ['n_g2', 'n_h'],
  ['n_h', 'n_i'],
  ['n_k', 'n_fountain_mid'],
  ['n_fountain_mid', 'n_capilla'],
  ['n_capilla', 'n_jardin_east'],
  ['n_jardin_east', 'n_i'],
  ['n_jardin_east', 'n_l'],
  ['n_atrio', 'n_atrio_east'],
  ['n_atrio_east', 'n_capilla'],
  ['n_atrio_east', 'n_l'],
  // External connections across Av. 14 de Septiembre
  ['n_ingreso', 'n_crosswalk_t'],
  ['n_crosswalk_t', 'n_t'],
  ['n_t', 'n_p'],
  ['n_ingreso', 'n_crosswalk_nso'],
  ['n_crosswalk_nso', 'n_n'],
  ['n_n', 'n_s'],
  ['n_s', 'n_o']
];

// Dijkstra shortest path
export function findShortestPath(startNodeId: string, endNodeId: string): { path: string[]; totalPx: number } {
  if (startNodeId === endNodeId) {
    return { path: [startNodeId], totalPx: 0 };
  }

  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const unvisited = new Set(Object.keys(GRAPH_NODES));

  Object.keys(GRAPH_NODES).forEach((n) => {
    dist[n] = Infinity;
    prev[n] = null;
  });

  dist[startNodeId] = 0;

  while (unvisited.size > 0) {
    let u: string | null = null;
    unvisited.forEach((n) => {
      if (u === null || dist[n] < dist[u]) u = n;
    });

    if (u === null || u === endNodeId || dist[u] === Infinity) break;
    unvisited.delete(u);

    GRAPH_EDGES.forEach(([a, b]) => {
      const neighbor = a === u ? b : b === u ? a : null;
      if (neighbor && unvisited.has(neighbor)) {
        const d = Math.hypot(
          GRAPH_NODES[u!].x - GRAPH_NODES[neighbor].x,
          GRAPH_NODES[u!].y - GRAPH_NODES[neighbor].y
        );
        if (dist[u!] + d < dist[neighbor]) {
          dist[neighbor] = dist[u!] + d;
          prev[neighbor] = u;
        }
      }
    });
  }

  const path: string[] = [];
  let curr: string | null = endNodeId;
  while (curr) {
    path.unshift(curr);
    curr = prev[curr] || null;
  }

  if (path[0] !== startNodeId) {
    return { path: [], totalPx: 0 };
  }

  return { path, totalPx: dist[endNodeId] || 0 };
}

export interface NavigationStep {
  icon: string;
  text: string;
  nodeId: string;
  action: 'start' | 'straight' | 'right' | 'left' | 'arrive';
}

export function generateTurnInstructions(
  pathIds: string[],
  originLoc: BuildingLocation,
  destLoc: BuildingLocation,
  roomLabel?: string | null
): NavigationStep[] {
  if (!pathIds || pathIds.length <= 1) {
    return [
      {
        icon: '📍',
        text: `Ya te encuentras en <strong>${destLoc.shortName}</strong>.${roomLabel ? ` Dirígete a: <em>${roomLabel}</em>` : ''}`,
        nodeId: pathIds[0] || originLoc.node,
        action: 'arrive'
      }
    ];
  }

  const steps: NavigationStep[] = [];
  const firstNextNode = GRAPH_NODES[pathIds[1]];
  steps.push({
    icon: '🚩',
    text: `Sal desde <strong>${originLoc.shortName}</strong> hacia <em>${firstNextNode ? firstNextNode.label : 'la caminería'}</em>.`,
    nodeId: pathIds[0],
    action: 'start'
  });

  for (let i = 1; i < pathIds.length - 1; i++) {
    const pPrev = GRAPH_NODES[pathIds[i - 1]];
    const pCurr = GRAPH_NODES[pathIds[i]];
    const pNext = GRAPH_NODES[pathIds[i + 1]];
    if (!pPrev || !pCurr || !pNext) continue;

    const v1 = { x: pCurr.x - pPrev.x, y: pCurr.y - pPrev.y };
    const v2 = { x: pNext.x - pCurr.x, y: pNext.y - pCurr.y };
    const cross = v1.x * v2.y - v1.y * v2.x;
    const dot = v1.x * v2.x + v1.y * v2.y;
    const angle = Math.atan2(cross, dot) * (180 / Math.PI);

    let dirIcon = '⬆️';
    let dirText = 'Continúa recto';
    let action: 'straight' | 'right' | 'left' = 'straight';

    if (angle > 35) {
      dirIcon = '↱';
      dirText = 'Gira a la derecha';
      action = 'right';
    } else if (angle < -35) {
      dirIcon = '↰';
      dirText = 'Gira a la izquierda';
      action = 'left';
    }

    steps.push({
      icon: dirIcon,
      text: `${dirText} al pasar por <strong>${pCurr.label}</strong> hacia <em>${pNext.label}</em>.`,
      nodeId: pathIds[i],
      action
    });
  }

  steps.push({
    icon: '🏁',
    text: `Has llegado a <strong>${destLoc.name}</strong>${
      roomLabel ? ` · Accede y dirígete a: <strong class="text-blue-600 dark:text-blue-400 underline">${roomLabel}</strong>` : '.'
    }`,
    nodeId: pathIds[pathIds.length - 1],
    action: 'arrive'
  });

  return steps;
}

export interface GuidedTour {
  id: string;
  title: string;
  badge: string;
  description: string;
  stops: {
    buildingId: string;
    stopTitle: string;
    explanation: string;
    highlightRoom?: string;
  }[];
}

export const GUIDED_TOURS: GuidedTour[] = [
  {
    id: 'cachorros_oficial',
    title: 'Tour Oficial del Cachorro UCB (Campus Obrajes)',
    badge: 'Recomendado',
    description: 'Los 6 lugares clave del plano oficial que todo nuevo universitario debe conocer.',
    stops: [
      {
        buildingId: 'ingreso',
        stopTitle: '1. Ingreso Principal (Av. 14 de Septiembre)',
        explanation: 'Acceso con molinetes biométricos y tótems digitales frente al Atrio.',
        highlightRoom: 'TOTEM-01'
      },
      {
        buildingId: 'bloque_k',
        stopTitle: '2. Bloque K · Kardex, Cajas y Rectorado',
        explanation: 'En el atrio central: aquí resuelves matrícula, pago de cuotas, certificados y becas DUBE.',
        highlightRoom: 'KARDEX-01'
      },
      {
        buildingId: 'agora',
        stopTitle: '3. El Ágora UCB',
        explanation: 'La gran plaza central rodeada por los bloques A, D y G. Espacio de descanso con mesas hexagonales.',
        highlightRoom: 'AGORA-PLAZA'
      },
      {
        buildingId: 'bloque_a',
        stopTitle: '4. Bloque A · Facultad de Ingeniería',
        explanation: 'El mayor edificio del ala norte, con laboratorios de robótica, materiales y dibujo técnico.',
        highlightRoom: 'A-101'
      },
      {
        buildingId: 'bloque_i',
        stopTitle: '5. Bloque I · Biblioteca Central San Pablo',
        explanation: 'Tres plantas con cubículos de estudio grupal, préstamos de libros y hemeroteca.',
        highlightRoom: 'BIB-PB'
      },
      {
        buildingId: 'capilla',
        stopTitle: '6. Capilla San Pablo y Jardines',
        explanation: 'Centro de espiritualidad y voluntariado Pastoral en medio de los jardines y fuentes.',
        highlightRoom: 'CAP-NAVE'
      }
    ]
  },
  {
    id: 'tramites_oficial',
    title: 'Circuito de Matrícula y Trámites Rápidos',
    badge: 'Administrativo',
    description: 'Ruta eficiente para resolver boletas, convalidaciones y habilitaciones.',
    stops: [
      {
        buildingId: 'ingreso',
        stopTitle: '1. Ingreso y Registro',
        explanation: 'Acceso por Av. 14 de Septiembre.',
        highlightRoom: 'SEG-01'
      },
      {
        buildingId: 'bloque_k',
        stopTitle: '2. Kardex Estudiantil (Bloque K)',
        explanation: 'Ventanilla de convalidaciones y certificación.',
        highlightRoom: 'KARDEX-01'
      },
      {
        buildingId: 'bloque_k',
        stopTitle: '3. Cajas y Tesorería (Bloque K)',
        explanation: 'Pago de cuotas y sellado de boletas.',
        highlightRoom: 'CAJAS-01'
      },
      {
        buildingId: 'bloque_i',
        stopTitle: '4. Activación en Biblioteca (Bloque I)',
        explanation: 'Habilitación de carnet para préstamo de textos y acceso a bases de datos.',
        highlightRoom: 'BIB-PB'
      }
    ]
  },
  {
    id: 'talleres_innovacion',
    title: 'Ruta de Talleres de Arquitectura y FabLab',
    badge: 'Innovación',
    description: 'Conoce los talleres de corte láser, maquetas y laboratorios de ingeniería.',
    stops: [
      {
        buildingId: 'bloque_t',
        stopTitle: '1. Bloque T · Talleres de Arquitectura',
        explanation: 'Tableros de diseño arquitectónico y mesas de crítica de proyectos.',
        highlightRoom: 'T-101'
      },
      {
        buildingId: 'bloque_p',
        stopTitle: '2. Bloque P · FabLab y Corte Láser',
        explanation: 'Cortadoras láser CO2, plotters e impresoras 3D para modelado de maquetas.',
        highlightRoom: 'P-FAB'
      },
      {
        buildingId: 'bloque_a',
        stopTitle: '3. Bloque A · Laboratorios de Ingeniería',
        explanation: 'Laboratorio de robótica, suelos y resistencia de materiales.',
        highlightRoom: 'LAB-CIV'
      }
    ]
  }
];

// Calibration: 1 px ≈ 0.42 m based on the real campus scale
export function pxToMeters(px: number): number {
  return Math.round(px * 0.42);
}

export function metersToMinutes(meters: number): number {
  const speedMetersPerMinute = 75;
  const minutes = meters / speedMetersPerMinute;
  return Math.max(1, Math.round(minutes * 10) / 10);
}
