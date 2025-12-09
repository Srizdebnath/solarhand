import { PlanetData } from './types';

// Note: Sizes and distances are scaled for visual clarity, not scientific accuracy.
// Texture paths assume files are placed in the public/textures/ directory.
export const PLANETS: PlanetData[] = [
  {
    id: 0,
    name: "Sun",
    color: "#FDB813",
    size: 2.5,
    distance: 0,
    speed: 0,
    description: "The Sun is the star at the center of our Solar System, primarily composed of hydrogen and helium. Its gravity holds the system together, keeping everything from the biggest planets to the smallest debris in orbit. It generates vast amounts of energy through nuclear fusion, providing the light and heat necessary for life on Earth.",
    textureUrl: "/textures/sun.jpg"
  },
  {
    id: 1,
    name: "Mercury",
    color: "#A5A5A5",
    size: 0.4,
    distance: 4,
    speed: 0.8,
    description: "Mercury is the smallest planet in our Solar System and the closest to the Sun. Despite its proximity, it is not the hottest planet because it lacks an atmosphere to trap heat. Its surface is scarred with craters, resembling Earth's Moon, and it experiences extreme temperature swings between day and night.",
    textureUrl: "/textures/mercury.jpg"
  },
  {
    id: 2,
    name: "Venus",
    color: "#E3BB76",
    size: 0.9,
    distance: 6,
    speed: 0.6,
    description: "Venus is the second planet from the Sun and the hottest in our solar system due to a thick, toxic atmosphere effectively trapping heat. Often called Earth's twin because of their similar size and structure, Venus spins in the opposite direction to most other planets. Its surface is dominated by volcanoes and vast lattice-like plains.",
    textureUrl: "/textures/venus.jpg"
  },
  {
    id: 3,
    name: "Earth",
    color: "#22A6B3",
    size: 1,
    distance: 8.5,
    speed: 0.5,
    description: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 71% of Earth's surface is covered with water, which is essential for all known forms of life. It has a protective atmosphere that shields us from meteoroids and harmful solar radiation.",
    textureUrl: "/textures/earth.jpg"
  },
  {
    id: 4,
    name: "Mars",
    color: "#EB4D4B",
    size: 0.6,
    distance: 11,
    speed: 0.4,
    description: "Mars, often called the Red Planet, is a dusty, cold, desert world with a very thin atmosphere. It is home to Olympus Mons, the largest volcano in the solar system, and Valles Marineris, one of the largest canyons. Evidence suggests that Mars was once wetter and warmer, with liquid water existing on its surface.",
    textureUrl: "/textures/mars.jpg"
  },
  {
    id: 5,
    name: "Jupiter",
    color: "#F0932B",
    size: 2.2,
    distance: 16,
    speed: 0.2,
    description: "Jupiter is the largest planet in our solar system, a gas giant more than twice as massive as all the other planets combined. It is known for its Great Red Spot, a centuries-old storm bigger than Earth. Jupiter has a strong magnetic field and dozens of moons, including the four large Galilean moons.",
    textureUrl: "/textures/jupiter.jpg"
  },
  {
    id: 6,
    name: "Saturn",
    color: "#F3D276",
    size: 1.8,
    distance: 21,
    speed: 0.15,
    description: "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, famous for its complex and beautiful ring system. It is a gas giant composed mostly of hydrogen and helium, much like Jupiter. Although its rings are vast, they are quite thin, made of ice particles, rocky debris, and dust.",
    textureUrl: "/textures/saturn.jpg"
  },
  {
    id: 7,
    name: "Uranus",
    color: "#7ED6DF",
    size: 1.2,
    distance: 25,
    speed: 0.1,
    description: "Uranus is an ice giant and the seventh planet from the Sun, mostly composed of flowing ices like water, methane, and ammonia. It is unique because it rotates on its side, likely the result of a massive collision in its past. This tilt causes extreme seasonal changes that can last for decades.",
    textureUrl: "/textures/uranus.jpg"
  },
  {
    id: 8,
    name: "Neptune",
    color: "#4834D4",
    size: 1.1,
    distance: 29,
    speed: 0.08,
    description: "Neptune is the eighth and farthest known planet from the Sun, a dark, cold, and windy ice giant. It was the first planet located through mathematical calculations rather than observation. Neptune has the strongest winds in the solar system, reaching speeds of up to 1,200 miles per hour.",
    textureUrl: "/textures/neptune.jpg"
  }
];