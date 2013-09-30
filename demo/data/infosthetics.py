from __future__ import print_function

posts = []
postsout=open('./infosthetic.tsv', 'w+', encoding='utf-8')

with open ("infosthetics.txt", "r", encoding='utf-8') as myfile:
    data=myfile.readlines()
    #print(data)
    for item in data:
        item = item.replace("\n","")
        line=item.partition(":")
        if item == "COMMENT":
            posts[-1]['comments'] = posts[-1]['comments']+1;
        elif line[0] == "AUTHOR":
            posts.append({'auth':line[2],'title':"",'category':"",'date':"",'url':"",'image':"",'comments':0})
        elif line[0] == "TITLE":
            posts[-1]['title'] = line[2].strip();
        elif line[0] == "CATEGORY":
            posts[-1]['category'] += line[2].strip()+",";
        elif line[0] == "DATE":
            posts[-1]['date'] = line[2].strip();
        elif line[0] == "URL":
            posts[-1]['url'] = line[2].strip();
        elif line[0] == "IMAGE":
            posts[-1]['image'] = line[2].strip();


for post in posts:
    print(post['auth']+"\t"+post['title']+"\t"+post['date']+"\t"+post['url']+"\t"+post['image']+"\t"+str(post['comments'])+"\t"+post['category'][:-1],file=postsout)




            
