import psycopg2
from .models import News

def parseBD():
    conn = psycopg2.connect(dbname='news', user='postgres', password='shievtsovm2001')
    cursor = conn.cursor()
    
    # Выполняем запрос.
    cursor.execute("SELECT * FROM newslist")
    records = cursor.fetchall()

    for IdBD,content,date in records:
        News.objects.update_or_create(
            content=content,
            date=date,
            defaults={'IdBD':IdBD}
        )
    
    # Закрываем подключение.
    cursor.close()
    conn.close()


if __name__ == "__main__":
    parseBD()