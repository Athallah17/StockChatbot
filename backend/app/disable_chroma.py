# disable_chroma.py
import chromadb.utils.embedding_functions as ef

# Override the default to avoid triggering ONNX
class DummyEmbeddingFunction:
    def __call__(self, texts):
        return [[0.0] * 384 for _ in texts]  # return dummy embeddings

ef.DefaultEmbeddingFunction = lambda: DummyEmbeddingFunction()
