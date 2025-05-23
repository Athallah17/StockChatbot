from db.database import engine
from db import models

models.Base.metadata.create_all(bind=engine)
