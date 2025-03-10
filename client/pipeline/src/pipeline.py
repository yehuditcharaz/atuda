import json
import os
import requests
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Generator, Iterator, List, Union
load_dotenv()

class Pipeline:
    class Valves(BaseModel):
        SERVER_URL: str = os.getenv("SERVER_URL")

    def __init__(self):
        self.name = "Ofer Chat"
        self.valves = self.Valves()
    async def pipe(
        self, user_message: str, model_id: str, messages: List[dict], body: dict
    ) -> Union[str, Generator, Iterator]:
        try:
            history = json.dumps({"messages":messages})
            response = requests.get(self.valves.SERVER_URL+'/chat', params={"query": history}) 
            response.raise_for_status()  
            json_response = response.json()
            if not isinstance(json_response, dict):
                print("An error occurred while connecting to the server.")
                raise ValueError("Something went wrong while generating the response, try again.")
            return convert_to_md(json_response)
        except Exception as e:  
                print(f"An error occurred: {e}")  
                return "Something went wrong while generating the response, try again."


def convert_to_md(response):
    try:
        if not isinstance(response, dict):
            print("convert to md failed:")  
            raise ValueError("Something went wrong while generating the response, try again.")
        md_output = []
        md_output.append(response.get('answer', 'There was a system error, try again.') + "\n")
        links = response.get("links", [])
        images = response.get("images", [])
        if links:
            md_output.append("**Source:**")
            md_output.extend(links)  
        if images:
            md_output.extend(images) 
        return "\n\n".join(md_output)
    except ValueError as e:
        print(f"Error processing markdown conversion: {e}")
        return "Something went wrong while generating the response, try again."
