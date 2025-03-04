from typing import List, Union, Generator, Iterator
# from schemas import OpenAIChatMessage
# from pydantic import BaseModel


class Pipeline:
    # class Valves(BaseModel):
    #     pass

    def __init__(self):

        # The name of the pipeline.
        self.name = "Ofer knowledge chat"
        pass

    async def on_startup(self):
        # This function is called when the server is started.
        print(f"on_startup:{__name__}")
        pass

    async def on_shutdown(self):
        # This function is called when the server is stopped.
        print(f"on_shutdown:{__name__}")
        pass

    async def on_valves_updated(self):
        # This function is called when the valves are updated.
        pass

    async def inlet(self, body: dict, user: dict) -> dict:
        # This function is called before the OpenAI API request is made. You can modify the form data before it is sent to the OpenAI API.
        print(f"inlet:{__name__}")

        print(body)
        print(user)

        return body

    async def outlet(self, body: dict, user: dict) -> dict:
        # This function is called after the OpenAI API response is completed. You can modify the messages after they are received from the OpenAI API.
        print(f"outlet:{__name__}")

        print(body)
        print(user)

        return body
    


    def pipe(
        self, user_message: str, model_id: str, messages: List[dict], body: dict
    ) -> Union[str, Generator, Iterator]:
        # This is where you can add your custom pipelines like RAG.
        print(f"pipe:{__name__}")

        # If you'd like to check for title generation, you can add the following check
        if body.get("title", False):
            print("Title Generation Request")
        else:
            print(messages)
            print(user_message)
            print(body)

            # Define the link you want to return

            # Return the sentence with the link
            return f"{__name__} {user_message}. "