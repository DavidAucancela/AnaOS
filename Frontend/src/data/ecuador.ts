// Datos de provincias, cantones y ciudades de Ecuador

export interface Canton {
  nombre: string;
  ciudades: string[];
}

export interface Provincia {
  nombre: string;
  cantones: Canton[];
}

export const provinciasEcuador: Provincia[] = [
  {
    nombre: 'Azuay',
    cantones: [
      { nombre: 'Cuenca', ciudades: ['Cuenca', 'Baños', 'Checa'] },
      { nombre: 'Gualaceo', ciudades: ['Gualaceo', 'Jadan'] },
      { nombre: 'Paute', ciudades: ['Paute', 'Bulán'] },
      { nombre: 'Sígsig', ciudades: ['Sígsig'] },
      { nombre: 'Girón', ciudades: ['Girón', 'Asunción'] },
    ],
  },
  {
    nombre: 'Bolívar',
    cantones: [
      { nombre: 'Guaranda', ciudades: ['Guaranda', 'San Miguel'] },
      { nombre: 'Chillanes', ciudades: ['Chillanes'] },
      { nombre: 'Chimbo', ciudades: ['Chimbo'] },
      { nombre: 'Echeandía', ciudades: ['Echeandía'] },
    ],
  },
  {
    nombre: 'Cañar',
    cantones: [
      { nombre: 'Azogues', ciudades: ['Azogues', 'Taday'] },
      { nombre: 'Biblián', ciudades: ['Biblián'] },
      { nombre: 'Cañar', ciudades: ['Cañar', 'Déleg'] },
      { nombre: 'La Troncal', ciudades: ['La Troncal'] },
    ],
  },
  {
    nombre: 'Carchi',
    cantones: [
      { nombre: 'Tulcán', ciudades: ['Tulcán', 'El Carmelo'] },
      { nombre: 'Montúfar', ciudades: ['San Gabriel', 'Cristóbal Colón'] },
      { nombre: 'Espejo', ciudades: ['El Ángel'] },
      { nombre: 'Mira', ciudades: ['Mira'] },
    ],
  },
  {
    nombre: 'Chimborazo',
    cantones: [
      { nombre: 'Riobamba', ciudades: ['Riobamba', 'Cacha', 'Cajabamba'] },
      { nombre: 'Alausí', ciudades: ['Alausí', 'Sibambe'] },
      { nombre: 'Colta', ciudades: ['Villa La Unión', 'Santiago de Quito'] },
      { nombre: 'Guano', ciudades: ['Guano', 'Valparaíso'] },
    ],
  },
  {
    nombre: 'Cotopaxi',
    cantones: [
      { nombre: 'Latacunga', ciudades: ['Latacunga', 'Alaques', 'Mulaló'] },
      { nombre: 'La Maná', ciudades: ['La Maná'] },
      { nombre: 'Pangua', ciudades: ['El Corazón'] },
      { nombre: 'Pujilí', ciudades: ['Pujilí', 'Zumbagua'] },
      { nombre: 'Salcedo', ciudades: ['San Miguel', 'Mulalillo'] },
    ],
  },
  {
    nombre: 'El Oro',
    cantones: [
      { nombre: 'Machala', ciudades: ['Machala', 'El Cambio'] },
      { nombre: 'Arenillas', ciudades: ['Arenillas', 'Palmales'] },
      { nombre: 'Atahualpa', ciudades: ['Paccha', 'Capiro'] },
      { nombre: 'Balsas', ciudades: ['Balsas'] },
      { nombre: 'Chilla', ciudades: ['Chilla'] },
      { nombre: 'El Guabo', ciudades: ['El Guabo', 'Barbones'] },
      { nombre: 'Huaquillas', ciudades: ['Huaquillas'] },
      { nombre: 'Las Lajas', ciudades: ['La Victoria'] },
      { nombre: 'Marcabelí', ciudades: ['Marcabelí'] },
      { nombre: 'Pasaje', ciudades: ['Pasaje', 'Buenavista'] },
      { nombre: 'Piñas', ciudades: ['Piñas', 'Saracay'] },
      { nombre: 'Portovelo', ciudades: ['Portovelo'] },
      { nombre: 'Santa Rosa', ciudades: ['Santa Rosa', 'Bellavista'] },
      { nombre: 'Zaruma', ciudades: ['Zaruma', 'Arcapamba'] },
    ],
  },
  {
    nombre: 'Esmeraldas',
    cantones: [
      { nombre: 'Esmeraldas', ciudades: ['Esmeraldas', 'Tachina'] },
      { nombre: 'Eloy Alfaro', ciudades: ['Valdez', 'Limones'] },
      { nombre: 'Muisne', ciudades: ['Muisne', 'Bunche'] },
      { nombre: 'Quinindé', ciudades: ['Rosa Zárate', 'Cube'] },
      { nombre: 'San Lorenzo', ciudades: ['San Lorenzo', 'Tambillo'] },
    ],
  },
  {
    nombre: 'Galápagos',
    cantones: [
      { nombre: 'San Cristóbal', ciudades: ['Puerto Baquerizo Moreno'] },
      { nombre: 'Isabela', ciudades: ['Puerto Villamil'] },
      { nombre: 'Santa Cruz', ciudades: ['Puerto Ayora'] },
    ],
  },
  {
    nombre: 'Guayas',
    cantones: [
      { nombre: 'Guayaquil', ciudades: ['Guayaquil', 'Durán', 'Eloy Alfaro'] },
      { nombre: 'Alfredo Baquerizo Moreno', ciudades: ['Juján'] },
      { nombre: 'Balao', ciudades: ['Balao'] },
      { nombre: 'Balzar', ciudades: ['General Antonio Elizalde'] },
      { nombre: 'Colimes', ciudades: ['Colimes'] },
      { nombre: 'Coronel Marcelino Maridueña', ciudades: ['Coronel Marcelino Maridueña'] },
      { nombre: 'Daule', ciudades: ['Daule', 'La Aurora'] },
      { nombre: 'Durán', ciudades: ['Eloy Alfaro', 'El Recreo'] },
      { nombre: 'El Empalme', ciudades: ['Velasco Ibarra', 'Eloy Alfaro'] },
      { nombre: 'El Triunfo', ciudades: ['El Triunfo'] },
      { nombre: 'Milagro', ciudades: ['Milagro', 'Chobo'] },
      { nombre: 'Naranjal', ciudades: ['Naranjal'] },
      { nombre: 'Naranjito', ciudades: ['Naranjito'] },
      { nombre: 'Nobol', ciudades: ['Nobol'] },
      { nombre: 'Palestina', ciudades: ['Palestina'] },
      { nombre: 'Pedro Carbo', ciudades: ['Pedro Carbo'] },
      { nombre: 'Samborondón', ciudades: ['Samborondón'] },
      { nombre: 'Santa Lucía', ciudades: ['Santa Lucía'] },
      { nombre: 'Salitre', ciudades: ['El Salitre'] },
      { nombre: 'San Jacinto de Yaguachi', ciudades: ['San Jacinto'] },
      { nombre: 'Playas', ciudades: ['General Villamil'] },
      { nombre: 'Simón Bolívar', ciudades: ['Simón Bolívar'] },
      { nombre: 'Yaguachi', ciudades: ['Yaguachi Nuevo', 'Yaguachi Viejo'] },
    ],
  },
  {
    nombre: 'Imbabura',
    cantones: [
      { nombre: 'Ibarra', ciudades: ['Ibarra', 'La Esperanza'] },
      { nombre: 'Antonio Ante', ciudades: ['Atuntaqui'] },
      { nombre: 'Cotacachi', ciudades: ['Cotacachi', 'Quiroga'] },
      { nombre: 'Otavalo', ciudades: ['Otavalo', 'González Suárez'] },
      { nombre: 'Pimampiro', ciudades: ['Pimampiro'] },
      { nombre: 'San Miguel de Urcuquí', ciudades: ['Urcuquí'] },
    ],
  },
  {
    nombre: 'Loja',
    cantones: [
      { nombre: 'Loja', ciudades: ['Loja', 'San Sebastián'] },
      { nombre: 'Calvas', ciudades: ['Cariamanga', 'Colaisaca'] },
      { nombre: 'Catamayo', ciudades: ['Catamayo', 'San José'] },
      { nombre: 'Celica', ciudades: ['Celica', 'Cruzpamba'] },
      { nombre: 'Chaguarpamba', ciudades: ['Chaguarpamba'] },
      { nombre: 'Espíndola', ciudades: ['Amaluza', 'Bellavista'] },
      { nombre: 'Gonzanamá', ciudades: ['Gonzanamá', 'Nambacola'] },
      { nombre: 'Macará', ciudades: ['Macará'] },
      { nombre: 'Olmedo', ciudades: ['Olmedo'] },
      { nombre: 'Paltas', ciudades: ['Catacocha', 'Guachanamá'] },
      { nombre: 'Pindal', ciudades: ['Pindal'] },
      { nombre: 'Puyango', ciudades: ['Alamor', 'Ciano'] },
      { nombre: 'Quilanga', ciudades: ['Quilanga'] },
      { nombre: 'Saraguro', ciudades: ['Saraguro', 'Urdaneta'] },
      { nombre: 'Sozoranga', ciudades: ['Sozoranga'] },
      { nombre: 'Zapotillo', ciudades: ['Zapotillo', 'Cazaderos'] },
    ],
  },
  {
    nombre: 'Los Ríos',
    cantones: [
      { nombre: 'Babahoyo', ciudades: ['Babahoyo', 'Barreiro'] },
      { nombre: 'Baba', ciudades: ['Baba', 'Isla de Bejucal'] },
      { nombre: 'Montalvo', ciudades: ['Montalvo'] },
      { nombre: 'Puebloviejo', ciudades: ['Puebloviejo', 'Puerto Pechiche'] },
      { nombre: 'Quevedo', ciudades: ['Quevedo', 'San Camilo'] },
      { nombre: 'Urdaneta', ciudades: ['Catarama', 'Ricaurte'] },
      { nombre: 'Ventanas', ciudades: ['Ventanas', 'Zapotal'] },
      { nombre: 'Vínces', ciudades: ['Vínces', 'Antonio Sotomayor'] },
    ],
  },
  {
    nombre: 'Manabí',
    cantones: [
      { nombre: 'Portoviejo', ciudades: ['Portoviejo', 'Calceta'] },
      { nombre: 'Bolívar', ciudades: ['Calceta', 'Quiroga'] },
      { nombre: 'Chone', ciudades: ['Chone', 'Convento'] },
      { nombre: 'El Carmen', ciudades: ['El Carmen', 'Wilfrido Loor Moreira'] },
      { nombre: 'Flavio Alfaro', ciudades: ['Flavio Alfaro'] },
      { nombre: 'Jama', ciudades: ['Jama'] },
      { nombre: 'Jaramijó', ciudades: ['Jaramijó'] },
      { nombre: 'Junín', ciudades: ['Junín'] },
      { nombre: 'Manta', ciudades: ['Manta', 'San Mateo'] },
      { nombre: 'Montecristi', ciudades: ['Montecristi', 'La Pila'] },
      { nombre: 'Olmedo', ciudades: ['Olmedo'] },
      { nombre: 'Paján', ciudades: ['Paján'] },
      { nombre: 'Pedernales', ciudades: ['Pedernales', 'Cojimíes'] },
      { nombre: 'Pichincha', ciudades: ['Pichincha'] },
      { nombre: 'Puerto López', ciudades: ['Puerto López'] },
      { nombre: 'Rocafuerte', ciudades: ['Rocafuerte'] },
      { nombre: 'San Vicente', ciudades: ['San Vicente', 'Canuto'] },
      { nombre: 'Santa Ana', ciudades: ['Santa Ana', 'Lodana'] },
      { nombre: 'Sucre', ciudades: ['Bahía de Caráquez', 'Leonidas Plaza'] },
      { nombre: 'Tosagua', ciudades: ['Tosagua'] },
      { nombre: 'Veinticuatro de Mayo', ciudades: ['Sucre', 'Bellavista'] },
    ],
  },
  {
    nombre: 'Morona Santiago',
    cantones: [
      { nombre: 'Macas', ciudades: ['Macas', 'Sevilla Don Bosco'] },
      { nombre: 'Gualaquiza', ciudades: ['Gualaquiza', 'Mercedes Molina'] },
      { nombre: 'Limón Indanza', ciudades: ['General Leonidas Plaza Gutiérrez'] },
      { nombre: 'Palora', ciudades: ['Palora', 'Arapicos'] },
      { nombre: 'Santiago', ciudades: ['Santiago', 'San Francisco de Chinimbimi'] },
      { nombre: 'Sucúa', ciudades: ['Sucúa'] },
      { nombre: 'Huamboya', ciudades: ['Huamboya'] },
      { nombre: 'San Juan Bosco', ciudades: ['San Juan Bosco'] },
      { nombre: 'Taisha', ciudades: ['Taisha'] },
      { nombre: 'Logroño', ciudades: ['Logroño'] },
      { nombre: 'Pablo Sexto', ciudades: ['Pablo Sexto'] },
      { nombre: 'Tiwintza', ciudades: ['Santiago de Tiwintza'] },
    ],
  },
  {
    nombre: 'Napo',
    cantones: [
      { nombre: 'Tena', ciudades: ['Tena', 'Ahuano'] },
      { nombre: 'Archidona', ciudades: ['Archidona'] },
      { nombre: 'El Chaco', ciudades: ['El Chaco'] },
      { nombre: 'Quijos', ciudades: ['Baeza', 'Cosanga'] },
      { nombre: 'Carlos Julio Arosemena Tola', ciudades: ['Carlos Julio Arosemena Tola'] },
    ],
  },
  {
    nombre: 'Orellana',
    cantones: [
      { nombre: 'Francisco de Orellana', ciudades: ['Puerto Francisco de Orellana', 'Inés Arango'] },
      { nombre: 'Aguarico', ciudades: ['Nuevo Rocafuerte'] },
      { nombre: 'La Joya de los Sachas', ciudades: ['La Joya de los Sachas'] },
      { nombre: 'Loreto', ciudades: ['Loreto'] },
    ],
  },
  {
    nombre: 'Pastaza',
    cantones: [
      { nombre: 'Puyo', ciudades: ['Puyo', 'Diez de Agosto'] },
      { nombre: 'Arajuno', ciudades: ['Arajuno'] },
      { nombre: 'Mera', ciudades: ['Mera'] },
      { nombre: 'Santa Clara', ciudades: ['Santa Clara'] },
    ],
  },
  {
    nombre: 'Pichincha',
    cantones: [
      { nombre: 'Quito', ciudades: ['Quito', 'Calderón', 'Conocoto'] },
      { nombre: 'Cayambe', ciudades: ['Cayambe', 'Olmedo'] },
      { nombre: 'Mejía', ciudades: ['Machachi', 'Aloag'] },
      { nombre: 'Pedro Moncayo', ciudades: ['Tabacundo', 'La Esperanza'] },
      { nombre: 'Rumiñahui', ciudades: ['Sangolquí', 'San Rafael'] },
      { nombre: 'San Miguel de Los Bancos', ciudades: ['San Miguel de Los Bancos'] },
      { nombre: 'Pedro Vicente Maldonado', ciudades: ['Pedro Vicente Maldonado'] },
      { nombre: 'Puerto Quito', ciudades: ['Puerto Quito'] },
    ],
  },
  {
    nombre: 'Santa Elena',
    cantones: [
      { nombre: 'Santa Elena', ciudades: ['Santa Elena', 'Atahualpa'] },
      { nombre: 'La Libertad', ciudades: ['La Libertad'] },
      { nombre: 'Salinas', ciudades: ['Salinas', 'Anconcito'] },
    ],
  },
  {
    nombre: 'Santo Domingo de los Tsáchilas',
    cantones: [
      { nombre: 'Santo Domingo', ciudades: ['Santo Domingo', 'Chiriboga'] },
      { nombre: 'La Concordia', ciudades: ['La Concordia', 'Valle Hermoso'] },
    ],
  },
  {
    nombre: 'Sucumbíos',
    cantones: [
      { nombre: 'Nueva Loja', ciudades: ['Nueva Loja', 'El Eno'] },
      { nombre: 'Cascales', ciudades: ['El Dorado de Cascales'] },
      { nombre: 'Cuyabeno', ciudades: ['Tarapoa'] },
      { nombre: 'Gonzalo Pizarro', ciudades: ['Lumbaquí'] },
      { nombre: 'Lago Agrio', ciudades: ['Lago Agrio'] },
      { nombre: 'Putumayo', ciudades: ['Puerto El Carmen de Putumayo'] },
      { nombre: 'Shushufindi', ciudades: ['Shushufindi'] },
    ],
  },
  {
    nombre: 'Tungurahua',
    cantones: [
      { nombre: 'Ambato', ciudades: ['Ambato', 'Atahualpa'] },
      { nombre: 'Baños de Agua Santa', ciudades: ['Baños de Agua Santa'] },
      { nombre: 'Cevallos', ciudades: ['Cevallos'] },
      { nombre: 'Mocha', ciudades: ['Mocha'] },
      { nombre: 'Patate', ciudades: ['Patate', 'El Triunfo'] },
      { nombre: 'Quero', ciudades: ['Quero'] },
      { nombre: 'San Pedro de Pelileo', ciudades: ['San Pedro de Pelileo', 'Benítez'] },
      { nombre: 'Santiago de Píllaro', ciudades: ['Santiago de Píllaro'] },
      { nombre: 'Tisaleo', ciudades: ['Tisaleo'] },
    ],
  },
  {
    nombre: 'Zamora Chinchipe',
    cantones: [
      { nombre: 'Zamora', ciudades: ['Zamora', 'Cumbaratza'] },
      { nombre: 'Chinchipe', ciudades: ['Zumba', 'Chito'] },
      { nombre: 'Nangaritza', ciudades: ['Guayzimi', 'Zurmi'] },
      { nombre: 'Yacuambi', ciudades: ['Yacuambi', '28 de Mayo'] },
      { nombre: 'Yantzaza', ciudades: ['Yantzaza', 'Los Encuentros'] },
      { nombre: 'El Pangui', ciudades: ['El Pangui', 'Tundayme'] },
      { nombre: 'Centro Chinchipe', ciudades: ['Zumba'] },
      { nombre: 'Palanda', ciudades: ['Palanda', 'Valladolid'] },
      { nombre: 'Paquisha', ciudades: ['Paquisha'] },
    ],
  },
];

// Función helper para obtener cantones de una provincia
export const getCantonesByProvincia = (provinciaNombre: string): Canton[] => {
  const provincia = provinciasEcuador.find((p) => p.nombre === provinciaNombre);
  return provincia ? provincia.cantones : [];
};

// Función helper para obtener ciudades de un cantón
export const getCiudadesByCanton = (provinciaNombre: string, cantonNombre: string): string[] => {
  const provincia = provinciasEcuador.find((p) => p.nombre === provinciaNombre);
  if (!provincia) return [];
  const canton = provincia.cantones.find((c) => c.nombre === cantonNombre);
  return canton ? canton.ciudades : [];
};

// Función helper para obtener todas las provincias
export const getProvincias = (): string[] => {
  return provinciasEcuador.map((p) => p.nombre);
};

