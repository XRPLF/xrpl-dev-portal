import os
import base64
import qrcode
import platform
from PIL import Image
from pathlib import Path, PureWindowsPath, PurePath
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from xrpl.core import keypairs
from xrpl.utils import xrp_to_drops
from xrpl.models.transactions import Payment
from xrpl.transaction import sign
from xrpl.wallet.main import Wallet


def create_wallet(silent: False):
    """
    Generates a keypair
    """
    if not silent:
        print("1. Generating seed...")
        seed = keypairs.generate_seed()

        print("2. Deriving keypair from seed...")
        pub, priv = keypairs.derive_keypair(seed)

        print("3. Deriving classic addresses from keypair..\n")
        address = keypairs.derive_classic_address(pub)

    else:
        seed = keypairs.generate_seed()
        pub, priv = keypairs.derive_keypair(seed)
        address = keypairs.derive_classic_address(pub)
 
    return address, seed


def sign_transaction(xrp_amount, destination, ledger_seq, wallet_seq, password):
    """
    Signs transaction and returns signed transaction blob in QR code
    """
    print("1. Retrieving encrypted private key and salt...")
    with open(get_path("/WalletTEST/private.txt"), "r") as f:
        seed = f.read()
        seed = bytes.fromhex(seed)

    with open(get_path("/WalletTEST/salt.txt"), "rb") as f:
        salt = f.read()

    print("2. Initializing key...")
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        iterations=100000,
        salt=salt
    )

    key = base64.urlsafe_b64encode(kdf.derive(bytes(password.encode())))
    crypt = Fernet(key)

    print("3. Decrypting wallet's private key using password")
    seed = crypt.decrypt(seed)

    print("4. Initializing wallet using decrypted private key")
    _wallet = Wallet.from_seed(seed=seed.decode())

    validated_seq = ledger_seq

    print("5. Constructing payment transaction...")
    my_tx_payment = Payment(
        account=_wallet.address,
        amount=xrp_to_drops(xrp=xrp_amount),
        destination=destination,
        last_ledger_sequence=validated_seq + 100,
        # +100 to catch up with the ledger when we transmit the signed tx blob to Machine 2
        sequence=wallet_seq,
        fee="10"
    )

    print("6. Signing transaction...")
    my_tx_payment_signed = sign(transaction=my_tx_payment, wallet=_wallet)

    img = qrcode.make(my_tx_payment_signed.to_dict())

    print("7. Displaying signed transaction blob's QR code on the screen...")
    img.save(get_path("/WalletTEST/transactionID.png"))
    image = Image.open(get_path("/WalletTEST/transactionID.png"))
    image.show()

    print(f"RESULT: {my_tx_payment_signed.to_dict()}")
    print("END RESULT: Successful")


def get_path(file):
    """
    Get path (filesystem management)
    """

    global File_
    # Checks what OS is being used
    OS = platform.system()
    usr = Path.home()

    # Get PATH format based on the OS
    if OS == "Windows":
        File_ = PureWindowsPath(str(usr) + file)
    else: # Assuming Linux-style file format
        File_ = PurePath(str(usr) + file)

    return str(File_)


def create_wallet_directory():
    global File, Path_
    OS = platform.system()
    usr = Path.home()
    if OS == "Windows":
        # If it's Windows, use this path:
        print("- OS Detected: Windows")
        File = PureWindowsPath(str(usr) + '/WalletTEST')
        Path_ = str(PureWindowsPath(str(usr)))
    else:
        print("- OS Detected: Linux")
        # If it's Linux, use this path:
        File = PurePath(str(usr) + '/WalletTEST')
        Path_ = str(PurePath(str(usr)))

    if not os.path.exists(File):
        print("1. Generating wallet's keypair...")
        pub, seed = create_wallet(silent=True)

        print("2. Creating wallet's file directory...")
        os.makedirs(File)

        print("3. Generating and saving public key's QR code...")
        img = qrcode.make(pub)
        img.save(get_path("/WalletTEST/public.png"))

        print("4. Generating and saving wallet's salt...")
        salt = os.urandom(16)

        with open(get_path("/WalletTEST/salt.txt"), "wb") as f:
            f.write(salt)

        print("5. Generating wallet's filesystem password...")
        password = "This is a unit test password 123 !@# -+= }{/"
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            iterations=100000,
            salt=salt
        )

        key = base64.urlsafe_b64encode(kdf.derive(bytes(password.encode())))

        crypt = Fernet(key)

        print("6. Encrypting and saving private key by password...")
        priv = crypt.encrypt(bytes(seed, encoding='utf-8'))
        seed = crypt.encrypt(bytes(seed, encoding='utf-8'))

        with open(get_path("/WalletTEST/seed.txt"), "w") as f:
            f.write(seed.hex())

        with open(get_path("/WalletTEST/private.txt"), "w") as f:
            f.write(priv.hex())

        with open(get_path("/WalletTEST/public.txt"), "w") as f:
            f.write(pub)

    if os.path.exists(File):
        print(f"0. Wallet's filesystem already exist as the unit test has been performed before. Directory: {File}")


def showcase_wallet_address_qr_code():
    with open(get_path("/WalletTEST/public.txt"), "r") as f:
        print(f"0. Wallet Address: {f.read()}")

    __path = get_path("/WalletTEST/public.png")
    print(f"1. Getting address from {__path}...")
    print("2. Displaying QR code on the screen...")
    image = Image.open(get_path("/WalletTEST/public.png"))
    image.show()


if __name__ == '__main__':
    print("Airgapped Machine Unit Test (5 functions):\n")

    print(f"UNIT TEST 1. create_wallet():")
    _address, _seed = create_wallet(silent=False)
    print(f"-- RESULTS --\n"
          f"Address: {_address}\n"
          f"Seed: {_seed}\n"
          f"END RESULT: Successful"
          )

    print(f"\nUNIT TEST 2. create_wallet_directory():")
    create_wallet_directory()
    print("RESULT: Successful")

    print("\nUNIT TEST 3. showcase_wallet_address_qr_code():")
    showcase_wallet_address_qr_code()
    print("RESULT: Successful")

    print("\nUNIT TEST 4. get_path():")
    print("1. Getting files' path...\n")
    txt_file = get_path("/WalletTEST/FILE123.txt")
    png_file = get_path("/WalletTEST/PIC321.png")
    print(f"-- RESULTS --\n"
          f"txt_file: {txt_file}\n"
          f"png_file: {png_file}\n"
          f"END RESULT: Successful")

    print("\nUNIT TEST 5. sign_transaction():")
    print("Parameters: xrp_amount, destination, ledger_seq, wallet_seq, password")
    sign_transaction(
        xrp_amount=10,
        destination="rPEpirdT9UCNbnaZMJ4ENwKAwJqrTpvgMQ",
        ledger_seq=32602000,
        wallet_seq=32600100,
        password="This is a unit test password 123 !@# -+= }{/"
    )
