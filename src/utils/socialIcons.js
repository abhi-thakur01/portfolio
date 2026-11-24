import { Github, Instagram, Link, Linkedin, Mail, MessageCircle, Twitter } from "lucide-react";

const SOCIAL_ICONS = {
  github: Github,
  instagram: Instagram,
  linkedin: Linkedin,
  mail: Mail,
  email: Mail,
  whatsapp: MessageCircle,
  twitter: Twitter,
};

export function getSocialIcon(icon) {
  return SOCIAL_ICONS[String(icon || "").toLowerCase()] || Link;
}
