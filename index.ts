import { Request, Response } from "express";
import express from "express";
import "dotenv/config";
import { searchCharacters } from "./services/CharacterService";
import { CharacterDTO } from "./dto";
const PORT = process.env.PORT || 3000;

const app = express();

app.get("/api/characters", async (req: Request, res: Response) => {
  try {
    const searchTerm: any = req.query.search;

    const characters: Array<CharacterDTO> = await searchCharacters(searchTerm);
    res.json(characters);
  } catch (error) {}
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
