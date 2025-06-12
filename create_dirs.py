import os

base_path = 'folders'
for i in range(1, 101):
    dir_path = os.path.join(base_path, str(i))
    os.makedirs(dir_path, exist_ok=True)
