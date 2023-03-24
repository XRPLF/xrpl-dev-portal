from datetime import datetime

def categorize_dates(arr):
    past = []
    upcoming = []
    today = datetime.today()

    for obj in arr:
        end_date = datetime.strptime(obj['end_date'], '%B %d, %Y')
        if end_date < today:
            past.append(obj)
        else:
            upcoming.append(obj)

    return {'past': past, 'upcoming': upcoming}

export = {
    "categorize_dates": categorize_dates,
}
