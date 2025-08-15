import {
  Clock,
  Facebook,
  Linkedin,
  Truck,
  Twitter,
  XIcon,
  Youtube,
} from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const Footer = () => {
  return (
    <footer className="flex flex-col gap-4 px-4 py-5 bg-white/95 border-b border-farm-brown/10">
      <div className="flex flex-col md:flex-row gap-8 justify-between items-center py-2">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-farm-yellow rounded-full flex items-center justify-center">
            <span className="text-2xl">🐔</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-farm-brown">
              FreshFowl
            </h1>
            <p className="text-xs text-farm-brown/70 leading-none">
              Farm to Table
            </p>
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Dialog>
            <DialogTrigger className="text-farm-brown hover:text-farm-orange transition-colors font-medium">
              About
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About Destiny Link</DialogTitle>
                <DialogDescription>
                  Destiny Link is your trusted source for fresh eggs and chicken
                  in Kenya. We serve homes, hotels, and businesses with
                  farm-fresh products straight from our local suppliers.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className="text-farm-brown hover:text-farm-orange transition-colors font-medium">
              Contact
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Get in Touch</DialogTitle>
                <DialogDescription>
                  📍 Maua, Meru, Kenya
                  <br />
                  📞 Call/WhatsApp: 0729 359 878
                  <br />
                  📧 Email: destinylinkmaua@gmail.com
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className="text-farm-brown hover:text-farm-orange transition-colors font-medium">
              Term & Conditions
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Terms & Conditions</DialogTitle>
                <DialogDescription>
                  By placing an order with Destiny Link, you agree to provide
                  accurate delivery info. All payments are made on delivery
                  unless otherwise stated. Prices are subject to change based on
                  market rates.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className="text-farm-brown hover:text-farm-orange transition-colors font-medium">
              Cookie policy
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cookie Policy</DialogTitle>
                <DialogDescription>
                  We use cookies to improve your experience and analyze traffic.
                  By using our site, you agree to our use of cookies. We don’t
                  share your data with third parties.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </nav>
        <div className="flex items-center space-x-2">
          <a
            href="#"
            className="w-7 h-7 bg-farm-orange rounded-full flex items-center justify-center hover:bg-farm-orange/80"
          >
            <Facebook size={20} className="text-white" />
          </a>
          <a
            href="#"
            className="w-7 h-7 bg-farm-orange rounded-full flex items-center justify-center hover:bg-farm-orange/80"
          >
            <Twitter size={20} className="text-white" />
          </a>
          <a
            href="#"
            className="w-7 h-7 bg-farm-orange rounded-full flex items-center justify-center hover:bg-farm-orange/80"
          >
            <Youtube size={20} className="text-white" />
          </a>
          <a
            href="#"
            className="w-7 h-7 bg-farm-orange rounded-full flex items-center justify-center hover:bg-farm-orange/80"
          >
            <Linkedin size={20} className="text-white" />
          </a>
        </div>
      </div>
      <div className="mx-auto">
        <p className="text-sm text-farm-brown/90">
          &copy; 2025 Destiny Link. All rights reserved.
        </p>
        <p className="text-sm py-1 text-farm-brown/70 text-center">
          Powered by
          <span className="text-farm-orange hover:underline">
            <a
              href="https://onyx-devs.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              Olex Devs
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
