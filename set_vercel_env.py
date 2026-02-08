
import subprocess

env_vars = {
    "NEXT_PUBLIC_FIREBASE_API_KEY": "AIzaSyBVlPrMaNkWP3kSOIea18eLxbYaeYbzXd8",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "gateway-korea-2026.firebaseapp.com",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "gateway-korea-2026",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET": "gateway-korea-2026.firebasestorage.app",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "46584294470",
    "NEXT_PUBLIC_FIREBASE_APP_ID": "1:46584294470:web:13e465564980904bb6ee47"
}

def add_env_var(key, value):
    try:
        # Check if exists first to avoid error spam? No, just try add.
        # Command: echo value | npx vercel env add key production
        cmd = f"echo {value} | npx vercel env add {key} production"
        print(f"Adding {key}...")
        subprocess.run(cmd, shell=True, check=True)
        print(f"✅ Added {key}")
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Failed to add {key} (might already exist): {e}")

for key, value in env_vars.items():
    add_env_var(key, value)

print("🎉 All environment variables processed.")
