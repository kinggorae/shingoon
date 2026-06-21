#!/usr/bin/env python3
"""
SFTP 배포 — dist/ 를 원격(public_html)으로 미러링한다.
Hostinger처럼 셸이 nologin(SFTP 전용)인 계정에서도 동작한다 (paramiko는 SFTP 서브시스템만 사용).
원격에만 있는 파일(기존 워드프레스 등)은 삭제해 깨끗한 미러를 만든다.

환경변수: SSH_HOST, SSH_PORT, SSH_USER, SSH_PASSWORD, REMOTE_DIR(기본 public_html), LOCAL_DIR(기본 dist)
"""
import os
import stat
import sys

import paramiko

HOST = os.environ["SSH_HOST"]
PORT = int(os.environ.get("SSH_PORT", "22"))
USER = os.environ["SSH_USER"]
PASSWORD = os.environ["SSH_PASSWORD"]
REMOTE_ROOT = os.environ.get("REMOTE_DIR", "public_html").rstrip("/")
LOCAL_ROOT = os.environ.get("LOCAL_DIR", "dist")

print(f"[connect] {USER}@{HOST}:{PORT} → {REMOTE_ROOT}/")
transport = paramiko.Transport((HOST, PORT))
transport.connect(username=USER, password=PASSWORD)
sftp = paramiko.SFTPClient.from_transport(transport)

_made = set()


def ensure_dir(path: str) -> None:
    if not path or path in _made:
        return
    parts = path.split("/")
    cur = ""
    for p in parts:
        if not p:
            continue
        cur = f"{cur}/{p}" if cur else p
        if cur in _made:
            continue
        try:
            sftp.stat(cur)
        except IOError:
            sftp.mkdir(cur)
        _made.add(cur)


# 1) 로컬 파일 수집
local_files = set()
for root, _dirs, files in os.walk(LOCAL_ROOT):
    for f in files:
        full = os.path.join(root, f)
        rel = os.path.relpath(full, LOCAL_ROOT).replace(os.sep, "/")
        local_files.add(rel)
print(f"[local] {len(local_files)} files")

# 2) 업로드
ensure_dir(REMOTE_ROOT)
for rel in sorted(local_files):
    remote = f"{REMOTE_ROOT}/{rel}"
    ensure_dir(os.path.dirname(remote))
    sftp.put(os.path.join(LOCAL_ROOT, rel.replace("/", os.sep)), remote)
print(f"[upload] {len(local_files)} files done")


# 3) 원격에만 있는 파일 삭제 (기존 워드프레스 정리)
def walk_remote(path: str):
    out = []
    try:
        entries = sftp.listdir_attr(path)
    except IOError:
        return out
    for e in entries:
        rp = f"{path}/{e.filename}"
        if stat.S_ISDIR(e.st_mode):
            out += walk_remote(rp)
        else:
            out.append(rp)
    return out


prefix = f"{REMOTE_ROOT}/"
deleted = 0
for rf in walk_remote(REMOTE_ROOT):
    rel = rf[len(prefix):] if rf.startswith(prefix) else rf
    if rel not in local_files:
        try:
            sftp.remove(rf)
            deleted += 1
        except IOError as e:
            print(f"[skip-del] {rf}: {e}", file=sys.stderr)
print(f"[clean] removed {deleted} stale files")

sftp.close()
transport.close()
print("[done] 배포 완료")
