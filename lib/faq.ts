export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/** Questions fréquentes — vente de matériaux, livraison et devis en ligne. */
export const salesFaq: FaqItem[] = [
  {
    id: "livraison",
    question: "Pourquoi les frais de livraison ne sont-ils pas affichés en ligne ?",
    answer:
      "Les tarifs de livraison varient beaucoup selon votre adresse, la distance, le volume commandé et surtout les conditions d’accès au chantier (route étroite, terrain difficile, besoin d’un camion-grue, etc.). Nous ne pouvons donc pas proposer un tarif de transport fixe sur le site. Votre demande de devis nous permet d’étudier votre situation et de vous communiquer un prix de livraison adapté, en complément du montant des matériaux.",
  },
  {
    id: "retrait",
    question: "Les prix affichés sont-ils les mêmes si je viens sur place ?",
    answer:
      "Oui. Si vous venez récupérer vos matériaux directement chez nous à Sprimont, les prix HTVA affichés dans le catalogue correspondent aux tarifs appliqués sur votre facture. Le formulaire en ligne reste une demande de devis sans engagement, mais le montant des produits reflète bien nos prix comptoir.",
  },
  {
    id: "devis",
    question: "Pourquoi s’agit-il d’une demande de devis et non d’une commande en ligne ?",
    answer:
      "Chaque projet est différent : quantités, livraison ou retrait, produits sur commande, conditions d’accès… En validant votre sélection, vous nous transmettez une demande que nous étudions pour vous répondre avec un devis personnalisé. Rien n’est débité et rien n’est expédié automatiquement.",
  },
  {
    id: "htva",
    question: "Les prix du catalogue incluent-ils la TVA ?",
    answer:
      "Non, tous les prix affichés sont hors TVA (HTVA). La TVA applicable sera indiquée sur le devis et la facture définitifs établis par Clôtures Morel.",
  },
];
