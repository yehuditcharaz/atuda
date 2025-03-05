import json
import socketio
from typing import List, Union, Generator, Iterator
from pydantic import BaseModel,Field
import re
import requests
import os
import hashlib
# import config 

class Pipeline:
    class Valves(BaseModel):
       #SERVER_URL: str = config.SERVER_URL
        SERVER_URL:str="https://server-199581308623.us-central1.run.app"

    def __init__(self):
        self.name = "Ofer Chat"
        self.valves = self.Valves()

    async def on_startup(self): 
        pass

    def pipe(
        self, user_message: str, model_id: str, messages: List[dict], body: dict
    ) -> Union[str, Generator, Iterator]:
        json_string = json.dumps({"messages":messages})
        response = requests.get(self.valves.SERVER_URL+'/chat', params={"query": json_string})        
        return convert_to_md(response.json())

def convert_to_md(response):
    md_output = []
    md_output.append(response.get('answer', 'No answer provided.') + "\n")
    links = response.get("links", [])
    images = response.get("images", [])
    if links:
        md_output.append("**Source:**")
        md_output.extend(links)  
    if images:
        md_output.extend(images) 
    return "\n\n".join(md_output)