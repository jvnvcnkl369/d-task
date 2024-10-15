import axios from "axios";
import { Character } from "../models";
import { CharacterDTO, StarshipDTO } from "../dto";

const cache: Map<string, any> = new Map();
const cacheImages: Map<string, any> = new Map();

export const searchCharacters = async (searchTerm?: string) => {
  const allProccesedCharacters: Array<CharacterDTO> = [];
  let url = `${process.env.EXTERNAL_API}/${
    searchTerm ? `?search=${searchTerm}` : ""
  }`;
  
  while (url) {
    const response = await fetchWithCache(url);
    const batchProccesedCharacters: Array<CharacterDTO> = await Promise.all(response.results.map(processCharacter));
    allProccesedCharacters.push(...batchProccesedCharacters);
    url = response.next;
  }

  return allProccesedCharacters.sort((a, b) => a.name.localeCompare(b.name))
};

const processCharacter = async (characterData: Character) => {
  const { name, height, mass, gender, url } = characterData;
  const id = new URL(url).pathname.split('/')[3];
  const starships: Array<StarshipDTO> = await Promise.all(characterData.starships.map(fetchStarship));
  const imageUrl = `${process.env.CHARACTER_IMAGE_URL}/${id}`;
  const imageBase64 = await fetchImageAsBase64(imageUrl);

  return {
    id,
    name,
    height,
    mass,
    gender,
    starships,
    image: imageBase64,
  };
};

const fetchStarship = async (url: string): Promise<any> => {
  const startshipResponse = await fetchWithCache(url);

  return {
    name: startshipResponse.name,
    model: startshipResponse.model,
    manufacturer: startshipResponse.manufacturer,
    starship_class: startshipResponse.starship_class,
  };
};

const fetchWithCache = async (url: string): Promise<any> => {
  if (cache.get(url)) {
    return cache.get(url);
  }

  const response = await axios.get(url);
  cache.set(url, response.data);
  return response.data;
};

const fetchImageAsBase64 = async (url: string): Promise<any> => {
  if (cacheImages.get(url)) {
    return cacheImages.get(url);
  }

  const response = await axios.get(url, { responseType: "arraybuffer" });
  const imageBase64 = Buffer.from(response.data, "binary").toString("base64");
  cacheImages.set(url, imageBase64);
  return imageBase64
};
