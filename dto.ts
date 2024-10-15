export interface CharacterDTO {
    id: string,
    name: string,
    height: string,
    mass: string,
    gender: string,
    starships: StarshipDTO[],
    image: string
}

export interface StarshipDTO {
    name: string,
    model: string,
    manufacturer: string,
    starship_class: string
}