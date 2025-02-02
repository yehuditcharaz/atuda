import os
from dotenv import load_dotenv


load_dotenv()


class GCPConfig:
    PROJECT_ID = os.getenv("PROJECT_ID")
    LOCATION = os.getenv("LOCATION")
    GCS_BUCKET = os.getenv("GCS_BUCKET")
    GCS_BUCKET_URI = f"gs://" + (os.getenv("GCS_BUCKET"))
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    INDEX_ID = os.getenv("INDEX_ID")
    INDEX_ENDPOINT_ID = os.getenv("INDEX_ENDPOINT_ID")
    CHUNKS_FOLDER = "chunks",
    GOOGLE_CREDENTIALS = os.getenv("GOOGLE_CREDENTIALS")


class ModelConfig:
    MODEL_NAME = "gemini-2.0-flash-exp"
    GEMINI_OUTPUT_TOKEN_LIMIT = 8192
    EMBEDDING_MODEL_NAME = "text-embedding-004"
    EMBEDDING_TOKEN_LIMIT = 4096
    TOKEN_LIMIT = min(GEMINI_OUTPUT_TOKEN_LIMIT, EMBEDDING_TOKEN_LIMIT)
    SEARCH_KWARGS = {"k": 10}


class PromptConfig:
    TEXT_SUMMARIZATION = """You are an assistant tasked with summarizing tables \
    and text for retrieval. These summaries will be embedded and used to \
    retrieve the raw text or table elements. Give a concise summary of the table\
    or text that is well optimized for retrieval. Table or text: {element} """

    IMAGE_SUMMARIZATION = """You are an assistant tasked with summarizing visual\
    content (e.g., diagrams, tables, graphs, or schematics) related to systems,\
    performance, and components of the AW119 "Koala" helicopter (referred to as\
    "Ofer"). These summaries will be embedded and used for retrieving the \
    corresponding image based on specific questions or queries.

    ### General Instructions:
    1. **Focus**: Identify and highlight critical terms, labels, thresholds, \
        and unique identifiers visible in the image, emphasizing elements \
        likely to appear in queries.
    2. **File Metadata**: Always include the file name or identifier and a \
        general description of what the image contains at the beginning of the \
        summary. For example: "Figure 9-4: Performance graph showing...".
    3. **Context and Conditions**:
       - Explicitly state the context or conditions being depicted \
        (e.g., flight configuration, test environment, operational \
        conditions, or system state).
       - Emphasize what is being tested or demonstrated in the image, especially\
        if the information is similar to other visuals.
    4. **Uniqueness**: Ensure summaries are tailored to the specific image by \
        incorporating unique labels, terminology, and identifiers that \
        distinguish it from similar visuals.

    ### Specific Instructions by Image Type:
    1. **Diagrams or Schematics**:
       - Describe the structure, purpose, and connections between components.
       - Include key labels, visual markers, and relationships between elements.
       - Mention unique visual or structural details and the context of the \
        system or operation depicted.

    2. **Tables**:
       - Extract all data points in a structured and concise format.
       - Emphasize comparative metrics, unique values, significant thresholds, \
           and the context in which the data applies.

    3. **Graphs**:
       - Highlight the axes, trends, and critical points such as thresholds, \
            inflection points, or labeled zones.
       - Include context for the graph, such as the operational condition, \
            system state, or test scenario.
       - Incorporate unique elements like curve names, weights, or operational \
            limits.

    4. **Mixed Visuals \
        (e.g., graphs with annotations, schematics with overlays)**:
       - Provide a unified summary combining elements from all relevant \
            categories, emphasizing the primary purpose, context, and unique \
            details of the image.

    ### Formatting:
    - Always start the summary with the file name or figure label (if available)\
        followed by a concise, descriptive opening. Example: "Figure 9-4: \
        Performance graph showing..." or "File 'FuelSystem123.png': Diagram\
        illustrating the fuel system...".
    - Explicitly state the context, configuration, or test conditions visible \
        in the image. Example: "Figure 12-3: Graph showing engine performance \
        under standard temperature and pressure conditions (15°C, sea level)."
    - Use structured phrasing that facilitates quick comprehension and \
        retrieval. Avoid excessive details unrelated to the image's purpose.

    ### Important Notes:
    - Do not include assumptions, interpretations, or information not explicitly\
        visible in the image.
    - Avoid introductory phrases, comments, or notes; start directly with the \
        essential details.
    - Ensure clarity and technical accuracy in every summary.

    ### Examples:
    - **Diagram**: "File 'FuelFlow123.png': Diagram of a fuel system \
        illustrating tanks, pumps, and valves, with labeled connections showing\
        fuel flow directions and pressure thresholds under Cruise configuration."
    - **Graph**: "Figure 9-4: Performance graph showing true airspeed versus \
        torque for Cruise configuration with gross weight curves labeled for \
        2050 kg to 2850 kg and thresholds for MCP and TOP."
    - **Table**: "File 'EngineSpecs456.png': Table comparing engine parameters,\
        including power output (kW), fuel consumption (kg/h), and operating \
        limits across configurations for Takeoff and Cruise conditions."

    ### Objective:
    Ensure each summary captures the unique aspects of the image, includes its\
        file name or label, and explicitly describes the context or conditions\
        depicted to enable precise retrieval during question-answering tasks."""

    PROCESS_USER_QUERY = """You are a language assistant responsible for refining and translating user questions.

### Your Task:
1. If the question is in Hebrew:
   - Correct any spelling errors in Hebrew.
   - Translate the question into English accurately while preserving its meaning and intent.
   - Refine the phrasing in English to make the question clear, detailed, and contextually appropriate, without altering its original meaning or intent.

2. If the question is in English:
   - Correct any spelling errors.
   - Refine the phrasing to make the question clear, detailed, and contextually appropriate, while ensuring the meaning and intent remain unchanged.

3. Add additional context or clarification to the question only if it enhances the clarity or ensures the user’s intent is conveyed more effectively. Avoid adding irrelevant information.

### Output Rules:
- Provide **only** the final English version of the refined question. Do not include any greetings, comments, or explanations in your response.
- The refined question should stand alone, fully detailed and clear, without requiring further clarification.

### Examples:
#### Example 1:
Input: מה אני יעשה אם המסוק נוחת בשטח לא מסומן?
Output: What actions should I take if the helicopter lands in an unmarked and potentially unsafe area?

#### Example 2:
Input: How do I camoflage the helicopter to decieve the enemy and not get cauhgt?
Output: How can I effectively camouflage the helicopter to deceive the enemy while avoiding detection?

#### Example 3:
Input: מהי הדרך הכי יעילה לבדוק תקינות מנוע?
Output: What is the most effective and reliable method to assess the engine's functionality?

#### Example 4:
Input: מה עקרון הפעולה של ה SENSING RELAYS?
Output: What is the fundamental operating principle of sensing relays, and how are they typically used?

#### Example 5:
Input: איך אפשר לשפר את היציבות של המסוק בזמן ריחוף?
Output: What techniques or adjustments can improve the stability of the helicopter during hovering?

### Important Notes:
- Always aim for clarity, precision, and professionalism in your output.
- Ensure that the user feels the refined question retains the original meaning and intent.
- Do not include any text other than the final refined question itself.
  """

    GENERATION = """You are a learning assistant tasked with helping \
    trainees in the pilot course understand the 'Ofer' helicopter systems and \
    operating instructions. You will receive a mix of content, \
    including text, tables, and images, often in the form of charts or graphs.
    Provide clear, accurate, and professional answers to the user's questions \
    about the helicopter, using the information provided. Your responses should \
    focus exclusively on addressing the user's question in a concise and \
    professional manner, based on the materials you receive. Do not include any \
    remarks about the source of the materials, their format, or how they were \
    compiled. Simply deliver the most relevant and comprehensive answer to the \
    question, ensuring it aligns with the provided information."""


class UtilsConfig:
    DOCUMENTS_FOLDER_PATH = os.getenv("DOCUMENTS_FOLDER_PATH")
    IMAGES_FOLDER_PATH = os.getenv("IMAGES_FOLDER_PATH")
    BATCH_SIZE = 1000
    ID_KEY = "doc_id"
    MAX_TRIES = 6
