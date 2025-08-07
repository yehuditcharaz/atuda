from google import genai
from google.genai import types
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from typing import List, Dict
from tqdm import tqdm

from utils.config import Keys, QdrantConfig, ModelConfig


client = QdrantClient(host=QdrantConfig.HOST, port=QdrantConfig.PORT)
genai_client = genai.Client(api_key=Keys.GOOGLE_API_KEY,)

def create_collections():
    existing_collections = [c.name for c in client.get_collections().collections]

    for collection in [QdrantConfig.RESUME_COLLECTION, QdrantConfig.JOB_COLLECTION]:
        if collection not in existing_collections:
            client.create_collection(
                collection_name=collection,
                vectors_config=VectorParams(size=QdrantConfig.VECTOR_SIZE, distance=Distance.COSINE),
            )

def upsert_documents(docs: List[Dict], collection_name: str):
    points = []
    for doc in tqdm(docs):
        vector = embed(doc["text"])
        points.append(PointStruct(
            id=doc["id"],
            vector=vector,
            payload={
                "text": doc["text"],
                "db_id": doc["db_id"]
            }
        ))
    client.upsert(collection_name=collection_name, points=points)


def search_similar_by_id(source_id: str, source_collection: str, target_collection: str, top_k: int = 5):
    try:
        vector = get_vector_by_id(source_id, source_collection)
        if vector is None:
            return []

        hits = client.search(
            collection_name=target_collection,
            query_vector=vector,
            limit=top_k
        )
        return [(hit.payload["db_id"], hit.payload["text"], hit.score) for hit in hits]
    except Exception as e:
        print(e)


def get_vector_by_id( doc_id: str, collection_name: str):
    try:
        result = client.retrieve(
            collection_name=collection_name,
            ids=[doc_id],
            with_vectors=True
        )
        if not result:
            return None
        
        return result[0].vector
    except Exception as e:
        return None


def embed(text: str) -> List[float]:
    result = genai_client.models.embed_content(
        model=ModelConfig.EMBEDDING_MODEL,
        contents=text,
        config=types.EmbedContentConfig(task_type="SEMANTIC_SIMILARITY")
    )
    return result.embeddings[0].values
