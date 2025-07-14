"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.user.createMany({
            data: [
                {
                    email: "admin@gamehub.com",
                    name: "Admin",
                    password: yield bcrypt_1.default.hash("admin123", 10),
                    role: "ADMIN"
                },
                {
                    email: "user@gamehub.com",
                    name: "Usuario",
                    password: yield bcrypt_1.default.hash("user123", 10),
                    role: "USER"
                }
            ]
        });
        yield prisma.game.createMany({
            data: [
                {
                    id: 1,
                    title: "The Witcher 4",
                    description: "RPG de mundo abierto...",
                    price: 29.99,
                    rating: 4.9,
                    sales: 5000000,
                    genres: ["RPG", "Aventura"],
                    platforms: ["PC", "PlayStation", "Xbox"],
                    oferta: "Si",
                    images: ["https://i.redd.it/6y1li0h3o1n71.jpg"],
                    requirements: {
                        minimum: ["CPU: Intel Core i5-2500K", "GPU: NVIDIA GTX 660", "RAM: 6GB"],
                        recommended: ["CPU: Intel Core i7-3770", "GPU: NVIDIA GTX 770", "RAM: 8GB"]
                    },
                    trailerUrl: "Nthv4xF_zHU",
                    reviews: [
                        {
                            id: "1",
                            author: "ola",
                            rating: 4,
                            comment: "bueno",
                            date: "mayo"
                        }
                    ]
                },
                {
                    id: 2,
                    title: "Cyberpunk 2077",
                    description: "RPG de acción...",
                    price: 49.99,
                    rating: 4.5,
                    sales: 3000000,
                    oferta: "",
                    genres: ["RPG", "Shooter"],
                    platforms: ["PC", "PlayStation", "Xbox"],
                    images: ["https://www.notebookcheck.org/fileadmin/Notebooks/News/_nc3/Untitled3177.jpg"],
                    requirements: {
                        minimum: ["CPU: Intel Core i5-3570K", "GPU: NVIDIA GTX 780", "RAM: 8GB"],
                        recommended: ["CPU: Intel Core i7-4790", "GPU: NVIDIA GTX 1060", "RAM: 12GB"]
                    },
                    trailerUrl: "8X2kIfS6fb8",
                    reviews: [
                        {
                            id: "1",
                            author: "ola",
                            rating: 4,
                            comment: "bueno",
                            date: "mayo"
                        }
                    ]
                },
                {
                    id: 3,
                    title: "Red Dead Redemption 2",
                    description: "Historia épica del salvaje oeste que sigue a Arthur Morgan y la banda Van der Linde mientras huyen por América.",
                    price: 59.99,
                    rating: 4.8,
                    sales: 4500000,
                    oferta: "10%",
                    genres: ["Aventura", "Acción", "Mundo abierto"],
                    platforms: ["PC", "PlayStation", "Xbox"],
                    images: ["https://wallpapercat.com/w/full/2/6/4/656-3840x2160-desktop-4k-red-dead-redemption-background.jpg"],
                    requirements: {
                        minimum: ["CPU: Intel Core i5-2500K", "GPU: NVIDIA GTX 770", "RAM: 8GB"],
                        recommended: ["CPU: Intel Core i7-4770K", "GPU: NVIDIA GTX 1060", "RAM: 12GB"]
                    },
                    trailerUrl: "MyaYlbizpvs",
                    reviews: [
                        {
                            id: "1",
                            author: "JuanP",
                            rating: 5,
                            comment: "La mejor experiencia del oeste jamás creada",
                            date: "Noviembre 2023"
                        }
                    ]
                },
                {
                    id: 4,
                    title: "Elden Ring",
                    description: "Juego de rol de acción en un mundo abierto masivo creado por Hidetaka Miyazaki y George R.R. Martin.",
                    price: 59.99,
                    rating: 4.9,
                    sales: 20000000,
                    oferta: "",
                    genres: ["RPG", "Souls-like", "Mundo abierto"],
                    platforms: ["PC", "PlayStation", "Xbox"],
                    images: ["https://images5.alphacoders.com/135/1358238.jpeg"],
                    requirements: {
                        minimum: ["CPU: Intel Core i5-8400", "GPU: NVIDIA GTX 1060", "RAM: 12GB"],
                        recommended: ["CPU: Intel Core i7-8700K", "GPU: NVIDIA GTX 1070", "RAM: 16GB"]
                    },
                    trailerUrl: "E3Huy2cdih0",
                    reviews: [
                        {
                            id: "1",
                            author: "DarkSoulsFan",
                            rating: 5,
                            comment: "Obra maestra de FromSoftware",
                            date: "Febrero 2023"
                        }
                    ]
                },
                {
                    id: 5,
                    title: "God of War: Ragnarök",
                    description: "Kratos y Atreus se embarcan en un viaje mítico para enfrentar el Ragnarök en esta secuela épica.",
                    price: 69.99,
                    rating: 4.7,
                    sales: 11000000,
                    oferta: "15%",
                    genres: ["Acción", "Aventura"],
                    platforms: ["PlayStation"],
                    images: ["https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdl7Oi0s.png"],
                    requirements: {
                        minimum: ["CPU: N/A", "GPU: N/A", "RAM: N/A"],
                        recommended: ["CPU: N/A", "GPU: N/A", "RAM: N/A"]
                    },
                    trailerUrl: "F3jePdO9_jc",
                    reviews: [
                        {
                            id: "1",
                            author: "KratosLover",
                            rating: 5,
                            comment: "Espectacular en todos los aspectos",
                            date: "Diciembre 2022"
                        }
                    ]
                },
                {
                    id: 6,
                    title: "The Legend of Zelda: Tears of the Kingdom",
                    description: "La secuela de Breath of the Wild lleva a Link a nuevas alturas en una aventura expansiva por Hyrule.",
                    price: 59.99,
                    rating: 4.8,
                    sales: 18500000,
                    oferta: "",
                    genres: ["Aventura", "Acción", "Mundo abierto"],
                    platforms: ["Nintendo Switch"],
                    images: ["https://i.redd.it/o95erb6h9d6c1.png"],
                    requirements: {
                        minimum: ["CPU: N/A", "GPU: N/A", "RAM: N/A"],
                        recommended: ["CPU: N/A", "GPU: N/A", "RAM: N/A"]
                    },
                    trailerUrl: "sjxLF4IYnJc",
                    reviews: [
                        {
                            id: "1",
                            author: "ZeldaFan",
                            rating: 5,
                            comment: "Superó todas mis expectativas",
                            date: "Mayo 2023"
                        }
                    ]
                },
                {
                    id: 7,
                    title: "Starfield",
                    description: "RPG de Bethesda ambientado en el espacio que te permite explorar más de 1000 planetas.",
                    price: 69.99,
                    rating: 4.2,
                    sales: 6000000,
                    oferta: "20%",
                    genres: ["RPG", "Ciencia ficción", "Mundo abierto"],
                    platforms: ["PC", "Xbox"],
                    images: ["https://cdn.wallpapersafari.com/49/87/KRO6l0.jpg"],
                    requirements: {
                        minimum: ["CPU: AMD Ryzen 5 2600X", "GPU: AMD RX 5700", "RAM: 16GB"],
                        recommended: ["CPU: AMD Ryzen 5 3600X", "GPU: NVIDIA RTX 2080", "RAM: 16GB"]
                    },
                    trailerUrl: "kfYEiTdsyas",
                    reviews: [
                        {
                            id: "1",
                            author: "SpaceExplorer",
                            rating: 4,
                            comment: "Ambicioso pero con algunos problemas técnicos",
                            date: "Septiembre 2023"
                        }
                    ]
                },
                {
                    id: 8,
                    title: "Hogwarts Legacy",
                    description: "Juego de rol de acción ambientado en el mundo mágico de Harry Potter del siglo XIX.",
                    price: 59.99,
                    rating: 4.6,
                    sales: 15000000,
                    oferta: "10%",
                    genres: ["RPG", "Aventura", "Mundo abierto"],
                    platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
                    images: ["https://image.api.playstation.com/vulcan/ap/rnd/202011/0919/cDHU28ds7cCvKAnVQo719gs0.png"],
                    requirements: {
                        minimum: ["CPU: Intel Core i5-6600", "GPU: NVIDIA GTX 960", "RAM: 8GB"],
                        recommended: ["CPU: Intel Core i7-8700", "GPU: NVIDIA GTX 1080 Ti", "RAM: 16GB"]
                    },
                    trailerUrl: "S6GTl_vPRvU",
                    reviews: [
                        {
                            id: "1",
                            author: "PotterHead",
                            rating: 5,
                            comment: "El sueño de todo fan de Harry Potter hecho juego",
                            date: "Febrero 2023"
                        }
                    ]
                },
                {
                    id: 9,
                    title: "Baldur's Gate 3",
                    description: "RPG épico basado en D&D con narrativa profunda, combate táctico y libertad de elección sin precedentes.",
                    price: 59.99,
                    rating: 4.9,
                    sales: 8000000,
                    oferta: "",
                    genres: ["RPG", "Aventura", "Estrategia"],
                    platforms: ["PC", "PlayStation"],
                    images: ["https://pixelz.cc/wp-content/uploads/2023/09/baldurs-gate-3-cover-uhd-4k-wallpaper.jpg"],
                    requirements: {
                        minimum: ["CPU: Intel i5-4690", "GPU: NVIDIA GTX 970", "RAM: 8GB"],
                        recommended: ["CPU: Intel i7-8700K", "GPU: NVIDIA RTX 2060", "RAM: 16GB"]
                    },
                    trailerUrl: "OcP0WdH7rTs",
                    reviews: [
                        {
                            id: "1",
                            author: "DnDFanatic",
                            rating: 5,
                            comment: "El mejor RPG en décadas, absolutamente imprescindible",
                            date: "Agosto 2023"
                        }
                    ]
                },
                {
                    id: 10,
                    title: "Spider-Man 2",
                    description: "Peter Parker y Miles Morales unen fuerzas contra nuevos y peligrosos villanos en la vibrante Nueva York.",
                    price: 69.99,
                    rating: 4.8,
                    sales: 5000000,
                    oferta: "",
                    genres: ["Acción", "Aventura", "Superhéroes"],
                    platforms: ["PlayStation"],
                    images: ["https://images7.alphacoders.com/131/1317406.jpeg"],
                    requirements: {
                        minimum: ["CPU: N/A", "GPU: N/A", "RAM: N/A"],
                        recommended: ["CPU: N/A", "GPU: N/A", "RAM: N/A"]
                    },
                    trailerUrl: "cXSpEmPmbfc",
                    reviews: [
                        {
                            id: "1",
                            author: "SpideyFan",
                            rating: 5,
                            comment: "La mejor experiencia de Spider-Man hasta la fecha",
                            date: "Octubre 2023"
                        }
                    ]
                },
                {
                    id: 11,
                    title: "Alan Wake 2",
                    description: "Secuela de terror psicológico que sigue al escritor Alan Wake atrapado en una pesadilla sobrenatural.",
                    price: 59.99,
                    rating: 4.7,
                    sales: 2000000,
                    oferta: "15%",
                    genres: ["Terror", "Survival Horror", "Misterio"],
                    platforms: ["PC", "PlayStation", "Xbox"],
                    images: ["https://pixelz.cc/wp-content/uploads/2024/01/alan-wake-2-cover-uhd-4k-wallpaper.jpg"],
                    requirements: {
                        minimum: ["CPU: Ryzen 5 2600X", "GPU: RTX 2060", "RAM: 16GB"],
                        recommended: ["CPU: Ryzen 7 3700X", "GPU: RTX 3060", "RAM: 16GB"]
                    },
                    trailerUrl: "dlQ3FeNu5Yw",
                    reviews: [
                        {
                            id: "1",
                            author: "HorrorLover",
                            rating: 5,
                            comment: "Terror psicológico magistral con una narrativa absorbente",
                            date: "Noviembre 2023"
                        }
                    ]
                },
                {
                    id: 12,
                    title: "Final Fantasy XVI",
                    description: "Nueva entrega de la saga FF con combate acción-RPG, historia épica y espectaculares Eikons.",
                    price: 69.99,
                    rating: 4.6,
                    sales: 3000000,
                    oferta: "10%",
                    genres: ["RPG", "Acción", "Aventura"],
                    platforms: ["PlayStation"],
                    images: ["https://images8.alphacoders.com/131/1317843.jpeg"],
                    requirements: {
                        minimum: ["CPU: N/A", "GPU: N/A", "RAM: N/A"],
                        recommended: ["CPU: N/A", "GPU: N/A", "RAM: N/A"]
                    },
                    trailerUrl: "gV5rIW1Qums",
                    reviews: [
                        {
                            id: "1",
                            author: "FFLegend",
                            rating: 4,
                            comment: "Combate espectacular aunque la historia pierde fuelle",
                            date: "Julio 2023"
                        }
                    ]
                }
            ]
        });
        yield prisma.news.createMany({
            data: [
                {
                    id: '1',
                    titulo: 'Lanzamiento del nuevo juego exclusivo',
                    contenido: 'Estamos emocionados de anunciar el lanzamiento de nuestro nuevo juego exclusivo que revolucionará la industria de los videojuegos con gráficos de última generación y una jugabilidad innovadora.',
                    fecha: '15 Junio 2023',
                    imagen: 'https://via.placeholder.com/600x400?text=Nuevo+Juego',
                    autor: 'Equipo Editorial'
                },
                {
                    id: '2',
                    titulo: 'Actualización importante del servidor',
                    contenido: 'El próximo martes realizaremos una actualización importante del servidor que mejorará el rendimiento y añadirá nuevas características solicitadas por la comunidad.',
                    fecha: '10 Junio 2023',
                    autor: 'Administrador del Sistema'
                },
                {
                    id: '3',
                    titulo: 'Evento especial de verano',
                    contenido: 'Participa en nuestro evento especial de verano con premios exclusivos, descuentos en juegos seleccionados y torneos emocionantes. ¡No te lo pierdas!',
                    fecha: '1 Junio 2023',
                    imagen: 'https://via.placeholder.com/600x400?text=Evento+Verano',
                    autor: 'Equipo de Eventos'
                }
            ]
        });
        // Datos iniciales de juegos, noticias, etc.
    });
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
