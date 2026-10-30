/* ═══════════════════════════════════════════════════════════
   YERBA & BARRO · DATOS (demo)
   Para sumar un producto, agregalo a "productos".
   Las fotos son IDs de Unsplash (la parte después de "photo-").
═══════════════════════════════════════════════════════════ */
window.DATOS = {
  whatsapp: '5491145309135',          // destino del pedido (Bether Studio, es una demo)
  envioGratis: 60000, costoEnvio: 6500, offTransfer: 0.10, grabado: 3500,

  cats: {
    mates:   { nombre:'Mates',   foto:'1784475844948-e9abada34215', ambiente:'1765533088244-37cd08b9524d' },
    yerbas:  { nombre:'Yerbas',  foto:'1675001077188-809370ce3279', ambiente:'1559749619-5f290507d5e6' },
    termos:  { nombre:'Termos',  foto:'1486381950565-e3ada9f1a370', ambiente:'1681330816217-d0ff041b236b' },
    materas: { nombre:'Materas', foto:'1691480150204-66dd1eb77391', ambiente:'1681330816310-bbb4a5c1023f' }
  },

  /* Texto de la pestaña "Cuidados" según la categoría */
  cuidados: {
    mates:   ['Si es de calabaza o madera, ya viene curado: solo enjuagalo con agua tibia antes del primer uso.', 'Vacialo después de cada uso y dejalo secar boca abajo.', 'No uses detergente ni lo metas en el lavavajillas.'],
    yerbas:  ['Guardala en un lugar fresco y seco, lejos del sol.', 'Una vez abierta, pasala a una yerbera con cierre hermético.', 'Usá agua entre 70 y 80 °C para no quemarla.'],
    termos:  ['Precalentalo con un poco de agua caliente para que conserve mejor la temperatura.', 'Lavalo con agua tibia y un cepillo suave.', 'Dejalo secar destapado.'],
    materas: ['Limpiala con un paño apenas húmedo.', 'Hidratá el cuero cada tanto con crema neutra.', 'Evitá dejarla al sol por muchas horas.']
  },

  /* badge: 'top' (más vendido) o 'new'. Si tiene "antes", muestra el % de descuento.
     stock: si es bajo, aparece el aviso "Quedan pocas unidades" */
  productos: [
    { id:'m01', cat:'mates', nombre:'Mate imperial cincelado', precio:38900, foto:'1784475844948-e9abada34215', badge:'top', stock:3, rating:4.9, opiniones:128,
      desc:'Calabaza seleccionada con virola de alpaca cincelada a mano. Un clásico que dura toda la vida.', det:['Calabaza natural','Virola de alpaca','Curado incluido'] },
    { id:'m02', cat:'mates', nombre:'Mate imperial guarda pampa', precio:42500, foto:'1784475845364-f9cbad75ffd8', rating:4.8, opiniones:64,
      desc:'Forrado en cuero con guarda pampa tejida. Para regalar (o regalarte).', det:['Forro de cuero','Guarda tejida','Curado incluido'] },
    { id:'m03', cat:'mates', nombre:'Mate imperial de alpaca', precio:56000, foto:'1784475845427-81d1967770b9', badge:'new', stock:2, rating:5, opiniones:21,
      desc:'Nuestro mate más trabajado: base y virola de alpaca con detalles en relieve.', det:['Alpaca completa','Pieza única','Curado incluido'] },
    { id:'m04', cat:'mates', nombre:'Mate copa de alpaca', precio:34900, foto:'1784475844777-dc04755b82a3', rating:4.7, opiniones:39,
      desc:'Elegante y liviano, con pie de copa. Ideal para la oficina.', det:['Alpaca','Pie de copa','Curado incluido'] },
    { id:'m05', cat:'mates', nombre:'Mate de calabaza clásico', precio:14900, antes:17500, foto:'1609541994821-d909982e2f1b', rating:4.8, opiniones:212,
      desc:'El de toda la vida: calabaza curada y lista para usar.', det:['Calabaza natural','Tamaño mediano','Curado incluido'] },
    { id:'m06', cat:'mates', nombre:'Mate de cerámica terracota', precio:12500, foto:'1610098969315-cb01f18fbe87', rating:4.6, opiniones:47,
      desc:'Torneado a mano por ceramistas de Lanús. No necesita curado.', det:['Cerámica esmaltada','Sin curado','Hecho a mano'] },
    { id:'m07', cat:'mates', nombre:'Mate de cerámica crema', precio:11900, foto:'1585744259332-111384f5def9', rating:4.7, opiniones:33,
      desc:'Suave al tacto y fácil de lavar. Perfecto para empezar a matear.', det:['Cerámica esmaltada','Sin curado','Hecho a mano'] },
    { id:'m08', cat:'mates', nombre:'Mate de madera de algarrobo', precio:9800, foto:'1646233487430-cb90b0d61bf2', rating:4.5, opiniones:58,
      desc:'Madera de algarrobo del norte, con el sabor que solo da la madera.', det:['Algarrobo','Curado incluido','Hecho a mano'] },
    { id:'y01', cat:'yerbas', nombre:'Yerba orgánica 1 kg', precio:7900, foto:'1675001077188-809370ce3279', badge:'top', rating:4.9, opiniones:301,
      desc:'Suave, con palo y estacionada 18 meses. Certificada orgánica.', det:['1 kg','Con palo','Orgánica'] },
    { id:'y02', cat:'yerbas', nombre:'Yerba barbacuá 500 g', precio:5600, foto:'1559749619-5f290507d5e6', rating:4.8, opiniones:144,
      desc:'Secada al humo de leña: intensa, ahumada y con mucho cuerpo.', det:['500 g','Ahumada','Molienda gruesa'] },
    { id:'y03', cat:'yerbas', nombre:'Lata yerbera + yerba', precio:13900, foto:'1646233534579-163423f39c88', badge:'new', rating:4.7, opiniones:18,
      desc:'Lata de acero con 500 g de nuestra yerba orgánica. Para tenerla siempre fresca.', det:['Lata de acero','500 g de yerba','Cierre hermético'] },
    { id:'t01', cat:'termos', nombre:'Termo de acero 1 L', precio:39900, foto:'1486381950565-e3ada9f1a370', badge:'top', rating:4.9, opiniones:96,
      desc:'Mantiene el agua caliente 24 horas. Pico cebador de precisión.', det:['1 litro','24 h caliente','Pico cebador'] },
    { id:'t02', cat:'termos', nombre:'Termo negro mate 1,2 L', precio:36500, antes:41000, foto:'1609975031156-a626cd7001ef', stock:4, rating:4.7, opiniones:52,
      desc:'Acero inoxidable con terminación mate antideslizante.', det:['1,2 litros','Doble pared','Pico cebador'] },
    { id:'b01', cat:'materas', nombre:'Matera de cuero', precio:64900, foto:'1691480150204-66dd1eb77391', rating:4.9, opiniones:41,
      desc:'Cuero vacuno curtido al vegetal, con lugar para termo, mate y yerbera.', det:['Cuero vacuno','Correa regulable','Grabado disponible'] },
    { id:'b02', cat:'materas', nombre:'Mochila matera', precio:72000, foto:'1622560480605-d83c853bc5c3', badge:'new', stock:2, rating:4.8, opiniones:12,
      desc:'Para matear en la ruta: compartimento térmico y bolsillo para notebook.', det:['Cuero y lona','Compartimento térmico','Grabado disponible'] }
  ]
};
