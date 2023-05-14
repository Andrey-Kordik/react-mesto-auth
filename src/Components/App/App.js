import Header from '../Header';
import Footer from '../Footer/Footer.js';
import Main from '../Main/Main.js';
import ImagePopup from '../ImagePopup/ImagePopup.js';
import { useState, useEffect } from 'react';
import { api } from '../../utils/Api.js'
import { CurrentUserContext } from '../../contexts/CurrentUserContext.js'
import { CurrentCardsContext } from '../../contexts/CurrentCardsContext.js'
import EditProfilePopup from '../../Components/EditProfilePopup/EditProfilePopup.js'
import EditAvatarPopup from '../EditAvatarPopup/EditAvatarPopup.js';
import AddPlacePopup from '../AddPlacePopup/AddPlacePopup.js'
import PopupWithConfirm from '../PopupWithConfirm/PopupWithConfirm.js'

function App() {

  const [isEditProfilePopupOpen, setEditProfileOpen] = useState(false)
  const [isAddPlacePopupOpen, setAddPlaceOpen] = useState(false)
  const [isEditAvatarPopupOpen, setEditAvatarOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState({})
  const [isImagePopupOpen, setImagePopupOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState({})
  const [currentCards, setCurrentCards] = useState([])
  const [isPopupWithConfirmOpen, setPopupWithConfirmOpen] = useState(false);
  const [cardForDelete, setCardForDelete] = useState({})

  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [isLoadingAddPlace, setIsLoadingAddPlace] = useState(false);
  const [isLoadingSetUserInfo, setIsLoadingSetUserInfo] = useState(false);
  const [isLoadingCardDelete, setIsLoadingCardDelete] = useState(false);

  useEffect(() => {
    api.getUserData(currentUser)
      .then((data) => {
        setCurrentUser(data)
      })
      .catch(err => {
        console.log(err.message)
      })
  }, [])

  useEffect(() => {
    api.getCards(currentCards)
      .then((data) => {
        setCurrentCards(data)
      })
      .catch(err => {
        console.log(err.message)
      })
  }, [])

  function handleCardLike(card) {

    const isLiked = card.likes.some(i => i._id === currentUser._id)

    api.changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCurrentCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  function handleCardDelete(evt, card) {
    evt.preventDefault()
    setIsLoadingCardDelete(true)
    api.deleteCard(cardForDelete._id)
      .then(() => {
        const newCards = currentCards.filter((element) => element !== cardForDelete);
        setCurrentCards(newCards);
        closeAllPopups();
      })
      .catch(err => {
        console.log(err.message)
      })
      .finally(() => {
        setIsLoadingCardDelete(false);
      })
  }

  function handleCardClick(card) {
    setSelectedCard(card)
    setImagePopupOpen(true)
  }

  function handleEditAvatarClick() {
    setEditAvatarOpen(true)
  }

  function handleEditProfileClick() {
    setEditProfileOpen(true)
  }

  function handleAddPlaceClick() {
    setAddPlaceOpen(true)
  }

  function closeAllPopups() {
    setEditAvatarOpen(false)
    setEditProfileOpen(false)
    setAddPlaceOpen(false)
    setSelectedCard({})
    setImagePopupOpen(false)
    setPopupWithConfirmOpen(false)
  }

  function handleUpdateUser(data) {
    setIsLoadingSetUserInfo(true)
    api.editUserData(data)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups()
      })
      .catch(err => {
        console.log(err.message)
      })
      .finally(() => {
        setIsLoadingSetUserInfo(false);
      })
  }

  function handleUpdateAvatar(data) {
    setIsLoadingAvatar(true);
    api.editAvatar(data)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch(err => {
        console.log(err.message)
      })
      .finally(() => {
        setIsLoadingAvatar(false);
      })
  }

  function handleAddPlaceSubmit(data) {
    setIsLoadingAddPlace(true)
    api.addCard(data)
      .then((newCard) => {
        setCurrentCards([newCard, ...currentCards]);
        closeAllPopups();
      })
      .catch(err => {
        console.log(err.message)
      })
      .finally(() => {
        setIsLoadingAddPlace(false);
      })
  }

  function handleCardDeleteConfirmation(card) {
    setCardForDelete(card);
    setPopupWithConfirmOpen(true)
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentCardsContext.Provider value={currentCards}>
        <div className="project">
          <div className="page">
            <Header />
            <Main
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              user={currentUser}
              cards={currentCards}
              onCardLike={handleCardLike}
              onCardDeleteRequest={handleCardDeleteConfirmation}
            />
            <Footer />
          </div>
          <ImagePopup
            isOpen={isImagePopupOpen}
            card={selectedCard}
            onClose={closeAllPopups}
          />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            renderLoading={isLoadingSetUserInfo} />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            renderLoading={isLoadingAddPlace}
          />

          <PopupWithConfirm
            isOpen={isPopupWithConfirmOpen}
            onClose={closeAllPopups}
            onCardDelete={handleCardDelete}
            renderLoading={isLoadingCardDelete}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            renderLoading={isLoadingAvatar} />

        </div>
      </CurrentCardsContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
