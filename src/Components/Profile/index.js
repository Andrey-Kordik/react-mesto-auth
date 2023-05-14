import "./index.css"
import profileAvatar from '../../images/avatar.jpg'

function Profile () {
    return (
        <section className="profile">
        <div className="profile__info">
            <button className="profile__avatar-editbutton">
                <img className="profile__avatar" src= {profileAvatar} alt="фото исследователя"></img>
                <div className="profile__edit-avatar"></div>
            </button>
            <div className="profile__data">
                <h1 className="profile__heading">Жак-Ив Кусто</h1>
                <button className="profile__edit-button" type="button"></button>
                <p className="profile__subheading">Исследователь океана</p>
            </div>
        </div>
        <button className="profile__add-button" type="button">
        </button>
    </section>
    )
}

export default Profile