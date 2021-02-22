def get_users(queryset):
    ans={'name':[],'photo':[],'id':[]}
    for user in queryset:
        ans['name'].append(user.get_full_name())
        ans['photo'].append(user.photo.url)
        ans['id'].append(user.id)
    return ans