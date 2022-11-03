import os
import base64
import qrcode
import platform
from PIL import Image
from pathlib import Path, PureWindowsPath, PurePath
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from xrpl import wallet
from xrpl.core import keypairs
from xrpl.utils import xrp_to_drops
from xrpl.models.transactions import Payment
from xrpl.transaction import safe_sign_transaction


def create_wallet():
    """
    Generates a keypair
    """

    seed = keypairs.generate_seed()
    pub, priv = keypairs.derive_keypair(seed)

    address = keypairs.derive_classic_address(pub)
    private = keypairs.derive_classic_address(priv)
    print(
        f"\n\n       XRP WALLET CREDENTIALS"
        f"\n  Wallet Address: {address}"
        f"\n     Private Key: {private}"
        f"\n            Seed: {seed}"
          )

    return address, private, seed


def sign_transaction(_xrp_amount, _destination, _ledger_seq, _wallet_seq, password):
    """
    Signs transaction and returns signed transaction blob in QR code
    """

    with open(get_path("/Wallet/private.txt"), "r") as f:
        _seed = f.read()
        _seed = bytes.fromhex(_seed)

    with open(get_path("/Wallet/salt.txt"), "rb") as f:
        salt = f.read()

    # Line 49-58: initialize key
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        iterations=100000,
        salt=salt
    )

    key = base64.urlsafe_b64encode(kdf.derive(bytes(password.encode())))
    crypt = Fernet(key)
    
    # Decrypts the wallet's private key
    _seed = crypt.decrypt(_seed)
    
    # Initialize XRPL wallet using decrypted private key
    _wallet = wallet.Wallet(seed=_seed.decode(), sequence=0)

    validated_seq = _ledger_seq
    _wallet.sequence = _wallet_seq
    
    # Construct Payment transaction
    my_tx_payment = Payment(
        account=_wallet.classic_address,
        amount=xrp_to_drops(xrp=_xrp_amount),
        destination=_destination,
        last_ledger_sequence=validated_seq + 100, # +100 to catch up with the ledger when we transmit the signed tx blob to Machine 2
        sequence=_wallet.sequence,
        fee="10"
    )

    # Signs transaction and displays the signed_tx blob in QR code
    # Scan the QR code and transmit the signed_tx blob to an online machine (Machine 2) to relay it to the XRPL
    my_tx_payment_signed = safe_sign_transaction(transaction=my_tx_payment, wallet=_wallet)

    img = qrcode.make(my_tx_payment_signed.to_dict())
    img.save(get_path("/Wallet/transactionID.png"))
    image = Image.open(get_path("/Wallet/transactionID.png"))
    image.show()


def get_path(file):
    """
    Get path (filesystem management)
    """

    global File_
    # Checks what OS is being us
    OS = platform.system()
    usr = Path.home()

    # Get PATH format based on the OS
    if OS == "Windows":
        File_ = PureWindowsPath(str(usr) + file)
    if OS == "Linux":
        File_ = PurePath(str(usr) + file)

    return str(File_)


def main():
    global File, Path_
    
    # Gets the machine's operating system (OS)
    OS = platform.system()
    usr = Path.home()
    if OS == "Windows":
        # If it's Windows, use this path:
        File = PureWindowsPath(str(usr) + '/Wallet')
        Path_ = str(PureWindowsPath(str(usr)))
    if OS == "Linux":
        # If it's Linux, use this path:
        File = PurePath(str(usr) + '/Wallet')
        Path_ = str(PurePath(str(usr)))
        
    # If the Wallet's folder already exists, continue on
    if os.path.exists(File):
        while True:
            ask = int(input("\n 1. Transact XRP"
                            "\n 2. Generate an XRP wallet (read only)"
                            "\n 3. Showcase XRP Wallet Address (QR Code)"
                            "\n\n Enter Index: "
                            ))

            if ask == 1:
                password = str(input("             Enter Password: "))
                amount = float(input("\n           Enter XRP To Send: "))
                destination = input("\n        Enter Destination: ")
                wallet_sequence = int(input("\n    Enter Wallet Sequence: "))
                ledger_sequence = int(input("\n    Enter Ledger Sequence: "))

                sign_transaction(_xrp_amount=amount,
                                 _destination=destination,
                                 _ledger_seq=ledger_sequence,
                                 _wallet_seq=wallet_sequence,
                                 password=password
                                 )

                del destination, amount, wallet_sequence, ledger_sequence

            if ask == 2:
                _pub, _priv, _seed = create_wallet()

            if ask == 3:
                with open(get_path("/Wallet/public.txt"), "r") as f:
                    print(f"\n  Wallet Address: {f.read()}")

                image = Image.open(get_path("/Wallet/public.png"))
                image.show()

    else:
        # If the Wallet's folder does not exist, create one and store wallet data (encrypted private key, encrypted seed, account address) 
        pub, priv, seed = create_wallet()
        
        os.makedirs(File)
        
        img = qrcode.make(pub)
        img.save(get_path("/Wallet/public.png"))
        openimg = Image.open(get_path("/Wallet/public.png"))
        
        openimg.show()

        password = str(input("\n        Enter Password: "))
        salt = os.urandom(16)

        with open(get_path("/Wallet/salt.txt"), "wb") as f:
            f.write(salt)

        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            iterations=100000,
            salt=salt
        )

        key = base64.urlsafe_b64encode(kdf.derive(bytes(password.encode())))

        crypt = Fernet(key)

        priv = crypt.encrypt(bytes(seed, encoding='utf-8'))
        seed = crypt.encrypt(bytes(seed, encoding='utf-8'))

        with open(get_path("/Wallet/seed.txt"), "w") as f:
            f.write(seed.hex())

        with open(get_path("/Wallet/private.txt"), "w") as f:
            f.write(priv.hex())

        with open(get_path("/Wallet/public.txt"), "w") as f:
            f.write(pub)
            
        print("Re-run this script!") 


if __name__ == '__main__':
    main()
