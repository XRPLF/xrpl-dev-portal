from datetime import datetime

def categorize_dates(arr):
    past = []
    upcoming = []
    today = datetime.today()

    for obj in arr:
        end_date = datetime.strptime(obj['end_date'], '%B %d, %Y')
        if end_date < today:
            obj['type'] = obj['type'] + '-past'
            past.append(obj)
        else:
            obj['type'] = obj['type'] + '-upcoming'
            upcoming.append(obj)
    return {'past': past, 'upcoming': upcoming}

export = {
    "categorize_dates": categorize_dates,
}
