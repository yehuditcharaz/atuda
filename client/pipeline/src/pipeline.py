import json
import os
import requests
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Generator, Iterator, List, Union
load_dotenv()

class Pipeline:
    class Valves(BaseModel):
        # SERVER_URL: str = os.getenv("SERVER_URL")
        # SERVER_URL: str = "https://rag-service-dev-633427059080.us-central1.run.app"
        SERVER_URL: str = "https://rag-service-633427059080.us-central1.run.app"

    def __init__(self):
        self.name = 'Ofer Chat'
        self.valves = self.Valves()

    def pipe(
        self, user_message: str, model_id: str, messages: List[dict], body: dict
    ) -> Union[str, Generator, Iterator]:
        history = json.dumps({"messages":messages})
        response = requests.get(self.valves.SERVER_URL+'/chat', params={"query": history})        
        return convert_to_md(response.json())

def convert_to_md(response):
    md_output = []
    md_output.append(response.get('answer','There was a system error, try again.') + "\n")
    links = response.get("links", [])
    images = response.get("images", [])
    if links:
        md_output.append("**Source:**")
        md_output.extend(links)  
    if images:
        md_output.extend(images) 
    return "\n\n".join(md_output)
